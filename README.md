# Build tool for NEAR smart contracts

Currently supports Rust Contracts.

```bash
npm install -g @ahalabs/cli@ahalabs/cli
```

## Setup

### Get pinata account and add your API key to ENV

```bash
export PINATA_API_KEY=""
export PINATA_API_SECRET=""
```

### rust installation

[rustup](https://rustup.rs/)

```bash
rustup target add wasm32-unknown-unknown
```


## Commands

### `build`

'build' compiles a workspace of contracts and generates wit, ts, and json. The `json` is then pinned to IPFS using [Pinata](https://app.pinata.cloud/).
The resulting IPFS content address is written to a custom section in each contract binary.

Currently we use the `json` name for the custom section.