# Local proxy compatibility observation

Observed read-only on 2026-09-03 +08:00. No proxy setting, process, credential, packet or connection was modified.

## What is running

- Clash Verge Rev desktop and service processes are active.
- The active core is `verge-mihomo.exe`.
- Clash Verge reports TUN mode enabled and system proxy mode disabled.
- The Mihomo process had 67 established TCP connections during the observation, so it was actively carrying traffic.
- The configured mixed proxy listener is loopback port `7888`.

## Can Neko Master observe it now?

Not in the current configuration. Neko Master reads the Clash/Mihomo external-controller API; it does not infer traffic from the mixed proxy port and it is not a packet sniffer. Clash Verge currently reports `enable_external_controller: false`, and the configured controller endpoint `127.0.0.1:9097` was not reachable during the check.

## What would become observable after explicit setup?

If the external controller is deliberately enabled and protected with a secret, Neko Master can consume Mihomo connection snapshots and attribute traffic visible to Mihomo by destination/domain, source IP when supplied, rule and proxy chain. Because TUN mode is enabled, this can include most local-machine traffic routed through the TUN interface.

It still cannot see packet bodies, TLS plaintext, traffic that bypasses Mihomo, or a reliable application/process identity when the gateway API does not provide one.

## Safe next boundary

Enabling the controller and configuring a collector would change a security-sensitive local service and requires an explicit user request. A safe setup should bind the controller to loopback unless remote access is required, use a strong secret, avoid exposing the port publicly, and keep credentials server-side. The static Demo intentionally remains disconnected.
