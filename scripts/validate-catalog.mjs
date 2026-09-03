import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const REPOSITORY_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
export const CATALOG_PATH = path.join(REPOSITORY_ROOT, 'catalog', 'projects.json');

const PROJECT_KEYS = new Set([
  'id',
  'slug',
  'title',
  'repository',
  'summary',
  'status',
  'tags',
  'studyPath',
  'createdAt',
  'updatedAt',
  'cover',
  'demo',
]);
const REQUIRED_PROJECT_KEYS = [
  'id',
  'slug',
  'title',
  'repository',
  'summary',
  'status',
  'tags',
  'studyPath',
  'createdAt',
  'updatedAt',
  'cover',
];
const COVER_KEYS = new Set(['path', 'alt', 'caption', 'credit']);
const DEMO_KEYS = new Set(['sourcePath', 'buildOutput', 'publicPath', 'url', 'status']);
const PROJECT_STATUSES = new Set(['planned', 'studying', 'validated', 'archived']);
const DEMO_STATUSES = new Set(['planned', 'building', 'published', 'external', 'archived']);
const ID_PATTERN = /^(?:00[1-9]|0[1-9]\d|[1-9]\d{2})$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REPOSITORY_PATTERN = /^https:\/\/github\.com\/[^/\s]+\/[^/\s?#]+(?:\.git)?\/?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const COVER_EXTENSION_PATTERN = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

export class CatalogValidationError extends Error {
  constructor(errors) {
    super(`项目目录校验失败（${errors.length} 项）`);
    this.name = 'CatalogValidationError';
    this.errors = errors;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasOnlyKeys(value, allowedKeys, label, errors) {
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      errors.push(`${label} 包含未知字段 ${JSON.stringify(key)}`);
    }
  }
}

function requireKeys(value, requiredKeys, label, errors) {
  for (const key of requiredKeys) {
    if (!Object.hasOwn(value, key)) {
      errors.push(`${label} 缺少必填字段 ${JSON.stringify(key)}`);
    }
  }
}

function validateString(value, label, errors, { min = 1, max = Infinity, pattern } = {}) {
  if (typeof value !== 'string') {
    errors.push(`${label} 必须是字符串`);
    return false;
  }

  if (value.length < min || value.length > max) {
    const range = max === Infinity ? `至少 ${min}` : `${min}–${max}`;
    errors.push(`${label} 长度必须为 ${range} 个字符`);
    return false;
  }

  if (pattern && !pattern.test(value)) {
    errors.push(`${label} 格式不正确`);
    return false;
  }

  return true;
}

function validateDate(value, label, errors) {
  if (!validateString(value, label, errors, { pattern: DATE_PATTERN })) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    errors.push(`${label} 不是有效的日历日期`);
    return false;
  }

  return true;
}

export function isSafeRepositoryPath(value) {
  if (typeof value !== 'string' || value.length === 0 || value.includes('\\') || value.includes('\0')) {
    return false;
  }

  if (path.posix.isAbsolute(value) || /^[A-Za-z]:/.test(value) || value.endsWith('/')) {
    return false;
  }

  const segments = value.split('/');
  return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}

export function resolveRepositoryPath(relativePath) {
  if (!isSafeRepositoryPath(relativePath)) {
    throw new Error(`不安全的仓库相对路径：${JSON.stringify(relativePath)}`);
  }

  const resolved = path.resolve(REPOSITORY_ROOT, ...relativePath.split('/'));
  const relative = path.relative(REPOSITORY_ROOT, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`路径超出仓库范围：${JSON.stringify(relativePath)}`);
  }

  return resolved;
}

function validateRepositoryPath(value, label, errors) {
  if (!isSafeRepositoryPath(value)) {
    errors.push(`${label} 必须是使用正斜杠、且不含 . 或 .. 段的仓库相对路径`);
    return false;
  }
  return true;
}

function validateReference(value, label, expectedType, errors) {
  let absolutePath;
  try {
    absolutePath = resolveRepositoryPath(value);
  } catch (error) {
    errors.push(`${label}：${error.message}`);
    return;
  }

  if (!fs.existsSync(absolutePath)) {
    errors.push(`${label} 指向不存在的路径 ${JSON.stringify(value)}`);
    return;
  }

  const stat = fs.lstatSync(absolutePath);
  if (stat.isSymbolicLink()) {
    errors.push(`${label} 不得指向符号链接 ${JSON.stringify(value)}`);
  } else if (expectedType === 'file' && !stat.isFile()) {
    errors.push(`${label} 必须指向文件 ${JSON.stringify(value)}`);
  } else if (expectedType === 'directory' && !stat.isDirectory()) {
    errors.push(`${label} 必须指向目录 ${JSON.stringify(value)}`);
  }
}

function validateCover(cover, label, errors, checkFiles) {
  if (!isPlainObject(cover)) {
    errors.push(`${label} 必须是对象`);
    return;
  }

  hasOnlyKeys(cover, COVER_KEYS, label, errors);
  requireKeys(cover, [...COVER_KEYS], label, errors);
  const pathIsValid = validateRepositoryPath(cover.path, `${label}.path`, errors);
  if (pathIsValid && !COVER_EXTENSION_PATTERN.test(cover.path)) {
    errors.push(`${label}.path 必须使用 avif、gif、jpg、jpeg、png、svg 或 webp 图片扩展名`);
  }
  validateString(cover.alt, `${label}.alt`, errors, { max: 180 });
  validateString(cover.caption, `${label}.caption`, errors, { max: 240 });
  validateString(cover.credit, `${label}.credit`, errors, { max: 180 });

  if (checkFiles && pathIsValid) {
    validateReference(cover.path, `${label}.path`, 'file', errors);
  }
}

function validateStudyReadmeCover(studyPath, coverPath, label, errors) {
  if (!isSafeRepositoryPath(studyPath) || !isSafeRepositoryPath(coverPath)) {
    return;
  }

  const studyFile = resolveRepositoryPath(studyPath);
  if (!fs.existsSync(studyFile) || !fs.lstatSync(studyFile).isFile()) {
    return;
  }

  const relativeCoverPath = path.posix.relative(path.posix.dirname(studyPath), coverPath);
  const source = fs.readFileSync(studyFile, 'utf8');
  if (!source.includes(`](${relativeCoverPath})`)) {
    errors.push(`${label} 必须使用相对路径 ${JSON.stringify(relativeCoverPath)} 展示 catalog 中登记的核心图`);
  }
}

function validateDemo(demo, label, errors, checkFiles) {
  if (!isPlainObject(demo)) {
    errors.push(`${label} 必须是对象`);
    return;
  }

  hasOnlyKeys(demo, DEMO_KEYS, label, errors);
  requireKeys(demo, ['status'], label, errors);

  if (!DEMO_STATUSES.has(demo.status)) {
    errors.push(`${label}.status 必须是 ${[...DEMO_STATUSES].join('、')} 之一`);
  }

  for (const key of ['sourcePath', 'buildOutput', 'publicPath']) {
    if (Object.hasOwn(demo, key)) {
      validateRepositoryPath(demo[key], `${label}.${key}`, errors);
    }
  }

  if (Object.hasOwn(demo, 'publicPath') && !/^demos\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(demo.publicPath)) {
    errors.push(`${label}.publicPath 必须是 demos/<kebab-case> 形式`);
  }

  if (Object.hasOwn(demo, 'buildOutput') && (demo.buildOutput === 'dist' || demo.buildOutput.startsWith('dist/'))) {
    errors.push(`${label}.buildOutput 不得位于总库 dist 目录内`);
  }

  if (Object.hasOwn(demo, 'url')) {
    if (!validateString(demo.url, `${label}.url`, errors)) {
      // 字符串错误已记录。
    } else {
      try {
        const url = new URL(demo.url);
        if (url.protocol !== 'https:') {
          errors.push(`${label}.url 必须使用 https`);
        }
      } catch {
        errors.push(`${label}.url 必须是有效的绝对 URL`);
      }
    }
  }

  if (demo.status === 'building' || demo.status === 'published') {
    requireKeys(demo, ['sourcePath', 'buildOutput', 'publicPath'], label, errors);
  }
  if (demo.status === 'external') {
    requireKeys(demo, ['url'], label, errors);
  }

  if (checkFiles && typeof demo.sourcePath === 'string' && isSafeRepositoryPath(demo.sourcePath)) {
    validateReference(demo.sourcePath, `${label}.sourcePath`, 'directory', errors);
  }
}

export function validateCatalog(catalog, { checkFiles = true } = {}) {
  const errors = [];

  if (!isPlainObject(catalog)) {
    throw new CatalogValidationError(['目录根节点必须是对象']);
  }

  hasOnlyKeys(catalog, new Set(['$schema', 'version', 'updatedAt', 'projects']), '目录根节点', errors);
  requireKeys(catalog, ['version', 'updatedAt', 'projects'], '目录根节点', errors);
  if (Object.hasOwn(catalog, '$schema') && catalog.$schema !== './projects.schema.json') {
    errors.push('目录根节点.$schema 必须是 "./projects.schema.json"');
  }
  if (catalog.version !== 1) {
    errors.push('目录根节点.version 必须是数字 1');
  }
  const catalogUpdatedAtIsValid = validateDate(catalog.updatedAt, '目录根节点.updatedAt', errors);

  if (!Array.isArray(catalog.projects)) {
    errors.push('目录根节点.projects 必须是数组');
    throw new CatalogValidationError(errors);
  }

  const seenIds = new Set();
  const seenSlugs = new Set();
  const seenRepositories = new Set();
  const seenPublicPaths = new Set();
  let previousId = 0;

  catalog.projects.forEach((project, index) => {
    const label = `projects[${index}]`;
    if (!isPlainObject(project)) {
      errors.push(`${label} 必须是对象`);
      return;
    }

    hasOnlyKeys(project, PROJECT_KEYS, label, errors);
    requireKeys(project, REQUIRED_PROJECT_KEYS, label, errors);

    const idIsValid = validateString(project.id, `${label}.id`, errors, { pattern: ID_PATTERN });
    const slugIsValid = validateString(project.slug, `${label}.slug`, errors, { max: 80, pattern: SLUG_PATTERN });
    validateString(project.title, `${label}.title`, errors, { max: 100 });
    const repositoryIsValid = validateString(project.repository, `${label}.repository`, errors, { pattern: REPOSITORY_PATTERN });
    validateString(project.summary, `${label}.summary`, errors, { max: 240 });

    if (!PROJECT_STATUSES.has(project.status)) {
      errors.push(`${label}.status 必须是 ${[...PROJECT_STATUSES].join('、')} 之一`);
    }

    if (!Array.isArray(project.tags)) {
      errors.push(`${label}.tags 必须是数组`);
    } else {
      if (project.tags.length > 8) {
        errors.push(`${label}.tags 最多包含 8 项`);
      }
      const seenTags = new Set();
      project.tags.forEach((tag, tagIndex) => {
        if (validateString(tag, `${label}.tags[${tagIndex}]`, errors, { max: 32 })) {
          const normalizedTag = tag.toLocaleLowerCase('en-US');
          if (seenTags.has(normalizedTag)) {
            errors.push(`${label}.tags 含重复标签 ${JSON.stringify(tag)}`);
          }
          seenTags.add(normalizedTag);
        }
      });
    }

    const studyPathIsValid = validateRepositoryPath(project.studyPath, `${label}.studyPath`, errors);
    const createdAtIsValid = validateDate(project.createdAt, `${label}.createdAt`, errors);
    const updatedAtIsValid = validateDate(project.updatedAt, `${label}.updatedAt`, errors);

    if (idIsValid) {
      const numericId = Number(project.id);
      if (numericId <= previousId) {
        errors.push(`${label}.id 必须严格递增；${project.id} 不大于前一编号 ${String(previousId).padStart(3, '0')}`);
      }
      previousId = numericId;
      if (seenIds.has(project.id)) {
        errors.push(`${label}.id 与已有编号 ${project.id} 重复`);
      }
      seenIds.add(project.id);
    }

    if (slugIsValid) {
      if (seenSlugs.has(project.slug)) {
        errors.push(`${label}.slug 与已有 slug ${JSON.stringify(project.slug)} 重复`);
      }
      seenSlugs.add(project.slug);
    }

    if (repositoryIsValid) {
      const normalizedRepository = project.repository.replace(/\.git\/?$/, '').replace(/\/$/, '').toLocaleLowerCase('en-US');
      if (seenRepositories.has(normalizedRepository)) {
        errors.push(`${label}.repository 与已有仓库重复`);
      }
      seenRepositories.add(normalizedRepository);
    }

    if (idIsValid && slugIsValid && studyPathIsValid) {
      const expectedStudyPath = `research/${project.id}-${project.slug}/README.md`;
      if (project.studyPath !== expectedStudyPath) {
        errors.push(`${label}.studyPath 必须是 ${JSON.stringify(expectedStudyPath)}`);
      }
    }

    if (createdAtIsValid && updatedAtIsValid && project.updatedAt < project.createdAt) {
      errors.push(`${label}.updatedAt 不得早于 createdAt`);
    }
    if (catalogUpdatedAtIsValid && updatedAtIsValid && project.updatedAt > catalog.updatedAt) {
      errors.push(`${label}.updatedAt 不得晚于目录根节点.updatedAt；请同步更新目录日期`);
    }

    if (Object.hasOwn(project, 'cover')) {
      validateCover(project.cover, `${label}.cover`, errors, checkFiles);
    }
    if (Object.hasOwn(project, 'demo')) {
      validateDemo(project.demo, `${label}.demo`, errors, checkFiles);
      if (idIsValid && slugIsValid && isPlainObject(project.demo)) {
        const expectedSourcePath = `apps/${project.id}-${project.slug}`;
        const expectedBuildOutput = `${expectedSourcePath}/dist`;
        const expectedPublicPath = `demos/${project.id}-${project.slug}`;
        if (Object.hasOwn(project.demo, 'sourcePath') && project.demo.sourcePath !== expectedSourcePath) {
          errors.push(`${label}.demo.sourcePath 必须是 ${JSON.stringify(expectedSourcePath)}`);
        }
        if (Object.hasOwn(project.demo, 'buildOutput') && project.demo.buildOutput !== expectedBuildOutput) {
          errors.push(`${label}.demo.buildOutput 必须是 ${JSON.stringify(expectedBuildOutput)}`);
        }
        if (Object.hasOwn(project.demo, 'publicPath') && project.demo.publicPath !== expectedPublicPath) {
          errors.push(`${label}.demo.publicPath 必须是 ${JSON.stringify(expectedPublicPath)}`);
        }
      }
      if (isPlainObject(project.demo) && typeof project.demo.publicPath === 'string') {
        if (seenPublicPaths.has(project.demo.publicPath)) {
          errors.push(`${label}.demo.publicPath 与已有 Demo 发布路径重复`);
        }
        seenPublicPaths.add(project.demo.publicPath);
      }
    }

    if (checkFiles && studyPathIsValid) {
      validateReference(project.studyPath, `${label}.studyPath`, 'file', errors);
      if (isPlainObject(project.cover) && typeof project.cover.path === 'string') {
        validateStudyReadmeCover(
          project.studyPath,
          project.cover.path,
          `${label}.studyPath`,
          errors,
        );
      }
    }
  });

  if (errors.length > 0) {
    throw new CatalogValidationError(errors);
  }

  return catalog;
}

export function loadCatalog({ checkFiles = true } = {}) {
  let source;
  try {
    source = fs.readFileSync(CATALOG_PATH, 'utf8');
  } catch (error) {
    throw new Error(`无法读取 ${path.relative(REPOSITORY_ROOT, CATALOG_PATH)}：${error.message}`);
  }

  let catalog;
  try {
    catalog = JSON.parse(source);
  } catch (error) {
    throw new Error(`catalog/projects.json 不是有效 JSON：${error.message}`);
  }

  return validateCatalog(catalog, { checkFiles });
}

function printFailure(error) {
  if (error instanceof CatalogValidationError) {
    console.error(error.message);
    for (const issue of error.errors) {
      console.error(`  - ${issue}`);
    }
  } else {
    console.error(error.message);
  }
}

function isMainModule() {
  return Boolean(process.argv[1]) && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
}

if (isMainModule()) {
  try {
    const catalog = loadCatalog({ checkFiles: true });
    console.log(`项目目录有效：${catalog.projects.length} 个项目，编号严格递增。`);
  } catch (error) {
    printFailure(error);
    process.exitCode = 1;
  }
}
