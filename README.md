# Build tool for NEAR smart contracts

Currently supports Rust Contracts.

```bash
npm install -g aha-cli
```

## Setup

### Get pinata account and add your API key

```bash
export PINATA_API_KEY=""
export PINATA_API_SECRET=""
```

### rust installation

[rustup](https://rustup.rs/)

```bash
rustup target add wasm32-unknown-unknown
```


### commands

- 'build' compiles the contracts, generates wit, ts, and json.  Then optionally can upload the 