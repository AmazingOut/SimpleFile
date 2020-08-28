
// We want to test the following aspects of the Tender Submission Registry (TSR):
//
//     Test 1: Ensure owner is first address - this ensures that the contract has been deployed by the expected authority.
//     Test 2: There are zero submissions at the beginning - this ensures that the developers have not embedded fraudulent entries in the code.
//     Test 3: Adding a Tender Submission works - testing core functionality of TSR.
//     Test 4: Tender hash string array is updated after successful adding of a Tender Submission - Useful for tracking submissions.
//     Test 5: Latest Tender Submission Hash can be retrieved from the tender hash string array - Confirm that tracking mechanisms are working as expected.
//     Test 6: Retrieving Tender Submission details for an existing submission using the ZIP File Hash works - testing core functionality of TSR (tracking submissions and corresponding details).
//     Test 7: retrieving Tender Submission address for an existing submission using the ZIP File Hash works - testing core functionality of TSR (tracking submissions and corresponding address).
//     Test 8: retrieving Tender Submission address for an non-existent submission using a Fake ZIP File Hash should not work - testing core functionality of TSR.
//     Test 9: retrieving Tender Submission details for an non-existent submission using a Fake ZIP File Hash should not work - testing core functionality of TSR.
//     Test 10: adding a Duplicate Tender Submission (i.e. Duplicate File ZIP Hash) should not work.

const TenderRegistry = artifacts.require('TenderRegistry');

contract('TenderRegistry', function (accounts) {
  // predefine parameters
  const ZIPFileDetails = 'ZIP File  test.zip (size 0.433993MB)';
  const ZIPFileHash = 'f149d75e984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311';
  const TenderSummary = '1003 - Train Data Center Operators';
  const SupplierDetails = '{SubmitterFullName:"John Doe", SubmitterIdentificationNumber:"12345678",SupplierID:123}';
  const SubmissionDate = 'Wed Feb 05 2020 00:09:56 GMT+0200 (South Africa Standard Time)';
  const SubmissionBlockNumber = 1;
  const IsSet = 1;

  const FakeZIPFileHash = '12345678984f1e919c4b896a0701637ff0260b834e1c18f3a9776c12fbf82311';

  // predefine the contract instance
  let TenderRegistryInstance;

  // predefine initial Tender Submission Counter which should be zero
  let initialTenderSubmissionCounter;

  // define owner for testing contract instance
  let owner;

  // before running the tests, set the value of the initialTenderSubmissionCounter
  // before() The before function runs before the testing begins and it can be used to set the adequate variables to be used in each test.
    before(async function () {
        // retrieve the deployed Tender Registry contract instance
        //TenderRegistryInstance = await TenderRegistry.deployed();

        // deploy a new Tender Registry contract
        TenderRegistryInstance = await TenderRegistry.new();

        // get the initial number of Tender Submissions
        initialTenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount();

        // set owner
        owner = await TenderRegistryInstance.owner();
        console.log("owner " + owner);
    });


  //it() It includes single units of tests, focused on testing specific aspects in a contract.

  // Test 1: there are zero submissions at the beginning
  it('ensure that owner is the first address', async  function () {
      assert.equal(owner, accounts[0]);
  });

  // Test 2: there are zero submissions at the beginning
  it('should contain zero Tender Submissions in the beginning', async function () {
    // fetch instance of TenderRegistry contract
    // get the number of Tender Submissions
    let tenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount()
    // check that there are no Tender Submissions initially
    assert.equal(tenderSubmissionCounter, 0, 'initial number not equal to zero');
  });

  // Test 3: adding a Tender Submission works
  it('should add a Tender Submission to the registry', async function () {
    // register a Tender Submission to the registry
    let tenderSubmissionIndex = await TenderRegistryInstance.registerTenderSubmission(ZIPFileDetails, ZIPFileHash, TenderSummary, SupplierDetails, SubmissionDate);

    let event = tenderSubmissionIndex.logs.some(l => { return l.event == "registeredTenderEvent" });

    // console.log(tenderSubmissionIndex.tx); // this works
    // console.log(tenderSubmissionIndex.logs); // this works
    // console.log(tenderSubmissionIndex.receipt); // this works

    // now we'll check that the registeredTenderEvent is emitted
    //console.log("event " + event); // output: event true
    assert.equal(event, true, 'Event registeredTenderEvent not emitted');
  });

  // Test 4: tender hash string array is updated after successful adding of a Tender Submission
  it('should increment Tender Submission hash array after adding to registry', async function () {
    // get the number of Tender Submissions
    let tenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount();

    assert.equal(tenderSubmissionCounter.toNumber(), initialTenderSubmissionCounter + 1,
        'Tender Submission was not successfully registered');
  });

  //Test 5: latest Tender Submission Hash can be retrieved from the tender hash string array
  it('should retrieve the Tender Hash', async function () {
    //retrieve from map using string array indexing
    let tenderSubmissionCounter = await TenderRegistryInstance.getTenderSubmissionsCount();
    console.log("tenderSubmissionCounter " + tenderSubmissionCounter);

    let latestTenderHashArrayIndex = tenderSubmissionCounter - 1;
    console.log("latestTenderHashArrayIndex " + latestTenderHashArrayIndex);

    let latestHash = await TenderRegistryInstance.getZipFileHashByIndex(latestTenderHashArrayIndex);
    console.log("latestHash " + latestHash);

    // check that it returns a match
    assert.equal(latestHash, ZIPFileHash, 'Hash retrieved from Blockchain does not match latest submission');
  });

  // Test 6: retrieving Tender Submission details for an existing submission using the ZIP File Hash works
  it('should verify a true Tender Submission from the registry', async function () {

    // retrieve the Tender Submission details
    let tenderSubmissionInstance =await TenderRegistryInstance.getTenderSubmission(ZIPFileHash);

    // check that they match the original Tender Submission details
    assert.equal(tenderSubmissionInstance[0], ZIPFileDetails, 'Tender Submission ZIP File Details do not match');
    assert.equal(tenderSubmissionInstance[1], ZIPFileHash, 'Tender Submission ZIP File Hash does not match');
    assert.equal(tenderSubmissionInstance[2], TenderSummary, 'Tender Submission tender summary does not match');
    assert.equal(tenderSubmissionInstance[3], SupplierDetails, 'Tender Submission supplier details do not match');
    assert.equal(tenderSubmissionInstance[4], SubmissionDate, 'Tender Submission date does not match');
  });

  // Test 7: retrieving submitter address from tendersAddressMap for an existing submission using the ZIP File Hash works
  it('should return a submitter address for an existing Tender Submission from the registry', async function () {

    // retrieve the Tender Submission details
    let tenderSubmissionAddress =await TenderRegistryInstance.getTenderSubmitterAddress(ZIPFileHash);

    // check that they match the original Tender Submission details
    console.log("tenderSubmissionAddress " + tenderSubmissionAddress);
    assert.equal(tenderSubmissionAddress, owner, 'ZIPFileHash does not correspond to Tender ZIP File Submitter address');
  });

    // Test 8: retrieving submitter address from tendersAddressMap for an non-existent submission using the ZIP File Hash works
  it('should identify a False Tender Submission hash by the returned address from the tendersAddressMap', async function () {

    // retrieve the Tender Submission details
    let tenderSubmissionAddress =await TenderRegistryInstance.getTenderSubmitterAddress(FakeZIPFileHash);

    // check that the returned address is a non-address i.e. 0x0000000000000000000000000000000000000000
    console.log("tenderSubmissionAddress " + tenderSubmissionAddress);
    assert(tenderSubmissionAddress === '0x0000000000000000000000000000000000000000', 'FakeZIPFileHash returned a Tender Submission address which is not expected behaviour');
  });

  // Test 9: retrieving Tender Submission details for an non-existent submission using a Fake ZIP File Hash does not work
  it('should identify a false Tender Submission from the registry', async function () {
    // retrieve Tender Submission details using a Fake Zip File Hash
    let tenderSubmissionInstance =await TenderRegistryInstance.getTenderSubmission(FakeZIPFileHash);

    //we expect the IsSet variable to be undefined for a fake Hash
    assert(tenderSubmissionInstance[7] === undefined, 'FakeZIPFileHash returned a Tender Submission which is not expected behaviour');
  });

    // Test 10: adding a Duplicate Tender Submission (i.e. Duplicate File ZIP Hash) should not work
  it('should not add a Duplicate File ZIP to the registry', async function () {
    let err = null;

    try {
      // Attempt to register a Tender Submission to the registry using a duplicate ZIPFileHash
      let tenderSubmissionIndex = await TenderRegistryInstance.registerTenderSubmission(ZIPFileDetails, ZIPFileHash, TenderSummary, SupplierDetails, SubmissionDate);
    } catch (error) {
      err = error
    }

    console.log(err);

    assert.ok(err instanceof Error, 'Event registeredTenderEvent was emitted which is not expected as you should not be able to register duplicate ZIPFileHashes');
  });


});
