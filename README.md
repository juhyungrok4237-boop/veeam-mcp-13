# Veeam VBR v13 MCP Server

![Veeam](https://img.shields.io/badge/Veeam-VBR_v13-00B336?style=for-the-badge&logo=veeam)
![MCP](https://img.shields.io/badge/Model_Context_Protocol-SDK_1.29-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)

Veeam Backup & Replication v13의 공식 REST API(1.3-rev1)를 활용하여 AI 에이전트(Claude Desktop, Cursor 등)가 Veeam 인프라를 직접 제어하고 모니터링할 수 있도록 해주는 **MCP(Model Context Protocol) 서버**입니다.

swagger.json 기준 **39개 태그, 404개 API Operations** 중 의미 있는 **328개의 MCP Tools**를 완전 모듈화하여 구현하였습니다.

---

## 📋 목차

- [주요 기능](#-주요-기능)
- [요구사항](#-요구사항)
- [패키지 의존성](#-패키지-의존성)
- [설치 및 빌드](#-설치-및-빌드)
- [환경 변수 설정](#-환경-변수-설정)
- [실행 방법 - stdio 모드](#-실행-방법---stdio-모드)
- [실행 방법 - SSE (HTTP) 모드](#-실행-방법---sse-http-모드)
- [지원되는 도구 카테고리](#-지원되는-도구-카테고리-총-328-tools)
- [프로젝트 구조](#-프로젝트-구조)
- [프롬프트 활용 예시](#-프롬프트-활용-예시)
- [라이선스](#-라이선스)

---

## 🌟 주요 기능

- **328개 MCP Tools**: Veeam REST API의 거의 모든 기능 포괄
- **듀얼 전송 모드**: `stdio` (로컬 AI 클라이언트) + `sse` (HTTP 원격 연동) 동시 지원
- **스마트 OAuth2 인증**: 자동 토큰 발급, 만료 전 갱신, 401 시 자동 재인증
- **완전 모듈화**: 13개 파일로 기능별 분리 → 유지보수 및 확장 용이
- **다중 SSE 세션 지원**: 여러 AI 클라이언트가 동시에 HTTP 모드로 접속 가능

---

## 📦 요구사항

| 항목 | 버전 | 비고 |
|------|------|------|
| **Node.js** | v18 이상 | `node -v`로 확인 |
| **npm** | v9 이상 | Node.js에 포함 |
| **Veeam B&R** | v13 | REST API 포트 `9419` 접근 필요 |
| **네트워크** | - | Veeam 서버의 `9419` 포트에 TCP 접근 가능해야 함 |

---

## 📚 패키지 의존성

### 런타임 의존성 (`dependencies`)

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `@modelcontextprotocol/sdk` | ^1.29.0 | MCP 서버 프레임워크 (stdio/SSE 전송 계층 포함) |
| `axios` | ^1.15.1 | Veeam REST API HTTP 클라이언트 |
| `express` | ^5.2.1 | SSE(HTTP) 모드 웹서버 |
| `dotenv` | ^17.4.2 | `.env` 파일에서 환경변수 로드 |
| `zod` | ^4.3.6 | MCP Tool 파라미터 스키마 검증 |
| `body-parser` | ^2.2.2 | Express 요청 본문 파싱 |

### 개발 의존성 (`devDependencies`)

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `typescript` | ^6.0.3 | TypeScript 컴파일러 |
| `tsx` | ^4.21.0 | TypeScript 직접 실행 (개발 모드) |
| `@types/node` | ^25.6.0 | Node.js 타입 정의 |
| `@types/express` | ^5.0.6 | Express 타입 정의 |
| `@types/body-parser` | ^1.19.6 | body-parser 타입 정의 |

---

## 🚀 설치 및 빌드

```bash
# 1. 리포지토리 클론
git clone https://github.com/<your-username>/veeam-mcp-self.git
cd veeam-mcp-self

# 2. 의존성 설치
npm install

# 3. TypeScript 빌드 (build/ 디렉토리에 JS 출력)
npm run build
```

> **개발 모드**: 빌드 없이 TypeScript를 직접 실행하려면 `npm run dev`를 사용하세요.

---

## ⚙️ 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성합니다. `.env.example`을 복사하여 수정하세요.

```bash
cp .env.example .env
```

```env
# ─── Veeam 서버 접속 정보 ─────────────────────────────────
VEEAM_SERVER=https://192.168.1.100
VEEAM_PORT=9419
VEEAM_USERNAME=Administrator
VEEAM_PASSWORD=YourPasswordHere

# ─── TLS 설정 ────────────────────────────────────────────
# Veeam 서버가 자체 서명 인증서를 사용하는 경우 0으로 설정
NODE_TLS_REJECT_UNAUTHORIZED=0

# ─── MCP 전송 모드 ───────────────────────────────────────
# stdio : Claude Desktop, Cursor 등 로컬 AI 클라이언트용
# sse   : HTTP 기반 원격 AI 에이전트 연동용
MCP_TRANSPORT_MODE=stdio

# ─── HTTP 포트 (SSE 모드 전용) ────────────────────────────
MCP_HTTP_PORT=3000
```

| 변수 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `VEEAM_SERVER` | ✅ | `https://localhost` | Veeam 서버 주소 (https 필수) |
| `VEEAM_PORT` | - | `9419` | REST API 포트 |
| `VEEAM_USERNAME` | ✅ | - | Veeam 관리자 계정 |
| `VEEAM_PASSWORD` | ✅ | - | Veeam 관리자 비밀번호 |
| `NODE_TLS_REJECT_UNAUTHORIZED` | - | `1` | `0`=자체 서명 인증서 허용 |
| `MCP_TRANSPORT_MODE` | - | `stdio` | `stdio` 또는 `sse` |
| `MCP_HTTP_PORT` | - | `3000` | SSE 모드 HTTP 포트 |

---

## 🖥️ 실행 방법 - stdio 모드

**stdio 모드**는 AI 클라이언트(Claude Desktop, Cursor 등)가 MCP 서버 프로세스를 직접 자식 프로세스로 실행하고, **표준 입출력(stdin/stdout)**을 통해 JSON-RPC 메시지를 주고받는 방식입니다.

### Claude Desktop 연동

`claude_desktop_config.json` 파일 위치:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "veeam-vbr": {
      "command": "node",
      "args": ["E:\\veeam-mcp-self\\build\\index.js"],
      "env": {
        "VEEAM_SERVER": "https://192.168.1.100",
        "VEEAM_PORT": "9419",
        "VEEAM_USERNAME": "Administrator",
        "VEEAM_PASSWORD": "YourPassword",
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

> ⚠️ `args`의 경로는 빌드된 `build/index.js`의 **절대 경로**로 지정해야 합니다.

### Cursor 에디터 연동

`.cursor/mcp.json` 파일:

```json
{
  "mcpServers": {
    "veeam-vbr": {
      "command": "node",
      "args": ["E:\\veeam-mcp-self\\build\\index.js"],
      "env": {
        "VEEAM_SERVER": "https://192.168.1.100",
        "VEEAM_PORT": "9419",
        "VEEAM_USERNAME": "Administrator",
        "VEEAM_PASSWORD": "YourPassword",
        "NODE_TLS_REJECT_UNAUTHORIZED": "0"
      }
    }
  }
}
```

### 수동 테스트 (터미널)

stdio 모드에서는 프로세스가 대화형으로 stdin을 읽기 때문에 직접 테스트하기 어렵습니다. MCP Inspector를 사용하세요:

```bash
# MCP Inspector 설치 및 실행
npx @modelcontextprotocol/inspector node build/index.js
```

브라우저에서 `http://localhost:5173`으로 접속하면 등록된 328개의 도구를 확인하고 직접 호출할 수 있습니다.

---

## 🌐 실행 방법 - SSE (HTTP) 모드

**SSE 모드**는 MCP 서버가 **Express HTTP 서버**로 독립 실행되며, AI 클라이언트가 Server-Sent Events(SSE)로 연결하여 통신하는 방식입니다. 원격 서버에 배포하거나, 여러 AI 클라이언트가 네트워크를 통해 동시에 접속할 때 사용합니다.

### 서버 실행

```bash
# 방법 1: .env 파일에 MCP_TRANSPORT_MODE=sse 설정 후
npm start

# 방법 2: 환경변수를 인라인으로 지정 (Linux/Mac)
MCP_TRANSPORT_MODE=sse MCP_HTTP_PORT=3000 npm start

# 방법 3: PowerShell (Windows)
$env:MCP_TRANSPORT_MODE="sse"; $env:MCP_HTTP_PORT="3000"; npm start

# 방법 4: 개발 모드 (빌드 없이 직접 실행)
$env:MCP_TRANSPORT_MODE="sse"; npm run dev
```

### 서버 실행 시 출력 예시

```
[MCP] Loaded 328 tools from 328 unique names.
[MCP] Starting HTTP/SSE mode on port 3000...
[MCP] HTTP server listening on http://0.0.0.0:3000
[MCP]   SSE endpoint : GET  http://localhost:3000/sse
[MCP]   Messages     : POST http://localhost:3000/messages?sessionId=<id>
[MCP]   Health       : GET  http://localhost:3000/health
```

### HTTP 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| `GET` | `/sse` | SSE 연결 수립 (클라이언트가 이 URL로 EventSource 연결) |
| `POST` | `/messages?sessionId=<id>` | JSON-RPC 메시지 전송 (세션 ID는 SSE 연결 시 할당) |
| `GET` | `/health` | 서버 상태 확인 (활성 세션 수 등) |

### Claude Desktop에서 SSE 모드 연동

```json
{
  "mcpServers": {
    "veeam-vbr-remote": {
      "url": "http://192.168.1.200:3000/sse"
    }
  }
}
```

### 서버 상태 확인

```bash
curl http://localhost:3000/health
```

응답:
```json
{
  "status": "ok",
  "mode": "sse",
  "activeSessions": 1,
  "server": "veeam-vbr-mcp v2.0.0"
}
```

---

## 🔧 stdio vs SSE 비교

| 항목 | stdio 모드 | SSE (HTTP) 모드 |
|------|-----------|----------------|
| **실행 주체** | AI 클라이언트가 자식 프로세스로 실행 | 독립 서버로 미리 실행 |
| **통신 방식** | stdin/stdout (표준 입출력) | HTTP + Server-Sent Events |
| **네트워크** | 로컬 전용 | 원격 접속 가능 |
| **다중 클라이언트** | 1:1 (한 클라이언트만) | N:1 (여러 클라이언트 동시) |
| **설정 난이도** | 쉬움 (JSON 설정만) | 서버 실행 + URL 지정 |
| **적합한 상황** | 개인 PC에서 Claude Desktop 사용 | 서버에 배포하여 팀 공유 |
| **환경변수** | `MCP_TRANSPORT_MODE=stdio` (기본값) | `MCP_TRANSPORT_MODE=sse` |

---

## 🛠️ 지원되는 도구 카테고리 (총 328 Tools)

| # | 모듈 파일 | 주요 기능 | 도구 수 |
|---|----------|----------|--------|
| 1 | `service.ts` | 서버 시간, 인증서, 서버 정보, 서비스 조회 | 5 |
| 2 | `license.ts` | 라이선스 설치/갱신, 소켓/인스턴스/용량 관리 | 16 |
| 3 | `credentials.ts` | 표준 계정 + 클라우드(AWS/Azure/GCP) 계정 CRUD | 23 |
| 4 | `encryption.ts` | 암호화 비밀번호, KMS 서버 관리 | 13 |
| 5 | `generalOptions.ts` | 이메일/알림 설정, 트래픽 규칙, 구성 백업, 배포 | 22 |
| 6 | `security.ts` | 보안 분석기, 멀웨어 감지, 사용자/역할, 전역 제외 | 35 |
| 7 | `inventory.ts` | VMware/HyperV 인벤토리, 클라우드/Entra ID 브라우저 | 23 |
| 8 | `infrastructure.ts` | 관리 서버, 저장소, SOBR, 프록시, 마운트 서버, WAN | 46 |
| 9 | `jobs.ts` | 백업/복제/복사 작업 CRUD, Start/Stop/Retry | 15 |
| 10 | `backups.ts` | 백업 데이터셋, 백업 개체, 복원 포인트 | 17 |
| 11 | `sessions.ts` | 세션/태스크 세션 조회, 로그, 중지 | 8 |
| 12 | `restore.ts` | IR(VMware/HyperV/Azure), VM 복원, FLR, Entra ID | 46 |
| 13 | `operations.ts` | 장애조치/원복, 복제본, 에이전트, 자동화 Import/Export | 59 |

---

## 📁 프로젝트 구조

```
veeam-mcp-self/
├── src/
│   ├── index.ts              # 진입점 (stdio/SSE 모드 분기)
│   ├── server.ts             # McpServer 인스턴스 + 동적 Tool 등록
│   ├── veeamClient.ts        # Axios 클라이언트 + OAuth2 자동 갱신
│   ├── types/
│   │   └── index.ts          # 공통 타입 (ToolDefinition, ok/err 헬퍼)
│   └── tools/
│       ├── index.ts          # 모든 모듈 통합 (328개 도구 배열)
│       ├── service.ts        # Service & Services
│       ├── license.ts        # License
│       ├── credentials.ts    # Credentials & Cloud Credentials
│       ├── encryption.ts     # Encryption & KMS
│       ├── generalOptions.ts # General Options, Traffic, Config Backup
│       ├── security.ts       # Security, Malware, Users, Exclusions
│       ├── inventory.ts      # Inventory Browser, Cloud Browser
│       ├── infrastructure.ts # Servers, Repos, Proxies, Mount, WAN
│       ├── jobs.ts           # Jobs
│       ├── backups.ts        # Backups, Objects, Restore Points
│       ├── sessions.ts       # Sessions, Task Sessions
│       ├── restore.ts        # All Restore Operations
│       └── operations.ts     # Failover, Failback, Agents, Automation
├── build/                    # TypeScript 컴파일 출력 (git 제외)
├── .env.example              # 환경변수 템플릿
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💬 프롬프트 활용 예시

이 MCP를 연결한 AI 비서에게 자연어로 명령할 수 있습니다:

### 모니터링
```
"최근 24시간 내 실패한 백업 작업이 있는지 알려줘"
"저장소의 남은 용량을 확인해줘"
"현재 실행 중인 작업 상태를 알려줘"
```

### 작업 제어
```
"DailyBackup 작업을 지금 즉시 실행해줘"
"Job ID xxxx-xxxx 를 비활성화해줘"
```

### 복원
```
"VM 'WebServer01'의 최신 복원 포인트를 찾아줘"
"해당 복원 포인트로 Instant Recovery를 시작해줘"
```

### 보안
```
"보안 준수 분석기를 실행해줘"
"멀웨어 감지 이벤트가 있는지 확인해줘"
```

### 인프라 관리
```
"등록된 모든 관리 서버와 프록시 상태를 알려줘"
"새로운 VMware vCenter 서버를 추가해줘"
```

---

## 📄 라이선스

이 프로젝트는 [Apache License 2.0](LICENSE)를 따릅니다

https://www.apache.org/licenses/LICENSE-2.0.txt

> Veeam® 및 Veeam Backup & Replication®은 Veeam Software Group GmbH의 등록 상표입니다. 이 프로젝트는 Veeam과 공식적으로 제휴되거나 보증되지 않습니다.
