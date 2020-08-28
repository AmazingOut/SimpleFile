# Design Pattern Decisions
Patterns help us in solving some very fundamental architectural design problems. 

## Design Patterns used for Tender Submission Registry (TSR)

### Contract Rollout

A Contract Rollout pattern is a development pattern that encourages testing and local deployment before deploying to mainnet.

This pattern has been used for TSR:

- Test suite with close to 100% test coverage
- Deployment on a local testnet (Ganache)
- Deployment on the public testnet (although without substantial testing and bug bounties as this is not a commercial project)


The following recommended practises of the Contract Rollout pattern have not been carried out as this is not a commercial project:
    
- Substantial testing and bug bounties after deployment to public testnet 
- Exhaustive testing (usage and load)
- Deployment to the mainnet in beta

### Circuit Breaker

A Circuit Breaker provides an emergency stop mechanism. Once a smart contract is deployed to blockchain, it cannot be changed. That’s why an unexpected bug can cause a lot of damage. Circuit breaker pattern stops certain functions from executing when an unexpected bug occurs.

In TSR, the circuit breaker is triggered by clicking on the Toggle Contract Status button. This can only be done the owner.
When this is triggered, the upload and verification features become disabled.


### Checks-Effects-Interaction 

Checks Effects Interaction Pattern is a design pattern that prevents an unexpected execution of a contract.
It checks all the prerequisites before executing a feature in a certain function.

This pattern has been used for TSR:

```
e.g. registerTenderSubmission
 // 1. Checks
 require(this.checkTenderSubmission(ZIPFileHash) == false, "Error: Cannot upload a previously submitted ZIP File.");

  
  // 2. Effects
  uint256 SubmissionBlocktime = block.timestamp;
        uint256 IsSet = 1;
 // Creates mapping between a FileHash and TenderSubmission struct and save in storage.
        tendersMap[ZIPFileHash] = TenderSubmission(ZIPFileDetails, ZIPFileHash, TenderSummary,
                                                   SupplierDetails, SubmissionDate, SubmissionBlocktime, IsSet);

  
  // 3. Interaction
  // trigger registeredTender event
        emit registeredTenderEvent(id);
```

## Design Patterns not used for Tender Submission Registry (TSR)

### Speed Bumps

In real life, speed bumps are meant to slow down the speed of a car on the road.
Speed Bump pattern is a programming pattern for limiting withdrawals by setting a time limit or an amount limit. 
It is for preventing many users from calling a certain function endless causing malfunction of the contract.

Speed Bumps has not been used for TSR as TSR is not a financial use case.


### Rate Limiting

Rate Limit pattern is a programming pattern that limits the frequency of calling a certain function. 

In the case of TSR, althouh this was not used, it can be usd in the future to prevent excessive calls / resource usage.

e.g. This could have been implemented to control number of submissions at a time.

```
contract TenderRegistry { 
  uint enabledAt = now; 
  
  modifier enabledEvery(uint t) { 
    if (now >= enabledAt) { 
      enabledAt = now + t; 
      _; 
    } 
  }
  
  function uploadTender() public enabledEvery(1 minutes) { 
    // some code 
  } 
}
```

### Bug Bounty Programs

Programs in which a budget is set aside for rewarding developers who find bugs in smart contract code.
Bug bounties are excellent in terms of ROI and having more eyes looking over existing code before deploying to production.

TSR is not being rolled out to a Production environment and so this is not required at this stage.


### Mutex Pattern

Mutex pattern is to prevent recursive calls from external contracts. 

This has not been implemented for TSR at this stage. A consideration for future work.


### Balance Limit Pattern

This pattern prevents sending more amount than the balance by setting the maximum amount of a balance of a smart contract. 

This is not required for TSR as TSR is not a financial application.


### Proxy Delegate

Introduce the possibility to upgrade smart contracts without breaking any dependencies.

Not used as TSR is not designed to be upgradeable for this stage. A consideration for future work.