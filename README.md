# codebuild-log-parser

For caching and parsing aws codebuild cloudwatch logs. Assumes aws token, secret and region are configured or exist in environment.

## Usage

Clone and install dependencies before getting started. This repository is not meant to be used as an npm dependency yet.

### Cache and Read

```bash
# cache log events
node . cache <groupName> <streamName>

# read cached events
node . read <groupName> <streamName>
```

#### Read

The "goto" promp

- enter one of the listed indices to go to the associated lines
- press enter without an input to go back

### Other Commands

```bash
# help
node . help

# clean cache
node . clean
```
