// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;


contract EHR{ 

    // DOCTOR
  struct Doctor {
    address id;
    address hospitalId;
    Proof proofCID;
  }
   struct DoctorPatients{
    address[] patientAddress;
  }

  struct ResearchPermission{
    address researchEntityId;
    address doctorId;
    bool access;
  }

  struct DoctorRequest{
    ResearchPermission[] researchPermissions;
  }

  // RESEARCH ENTITY 

  struct ResearchEntity{
    address id;
    Proof proofCID;
  }

 
  // PROOF

  struct Proof{
    string proofCID;
    string fileName;
  }

  // HOSPITAL
  
  struct Hospital {
    address id;
    Doctor[] doctors;
    Proof proofCID;
  }

  // PATIENT
  struct Record { 
    string cid;
    string fileName; 
    address patientId;
    address doctorId;
    uint256 timeAdded;
  }

  // EMERGENCY PERSON

  struct EmergencyAccess{
    address id;
    address patientId;
    bool isAccess;
  }

  struct AccessHistory{
    address doctorId;
    address personId;
    uint256 timeGiven;
    bool access;
  }

  struct Permission{
    bool access;
    address patientId;
    address doctorId;
    address hospitalId;
  }

   struct Patient {
    address id;
    Record[] records;
    Permission[] permissions;
    EmergencyAccess[] emergencyAccess;
    AccessHistory[] accessHistory;
  }


  // ADMIN
   address private constant ADMINID = 0xe30e325e0da4338B992999388145566a36D0fe6B;

  
  // EVENTS

  event HospitalAdded(address hospitalId);
  event DoctorAdded(address doctorId);
  event DoctorProofAdded(address doctorId);
  event RequestAdded(address patientId);
  event RecordAdded(string cid, address patientId, address doctorId); 
  event PatientAdded(address patientId);
  event HospitalProofAdded(address hospitalId);
  event EmergencyAdded(address personId);
  event manageEmergency(address personId);
  event AccessGranted(address doctorId);
  event EmergencyAccessGranted(address doctorId);
  event ResearchEntityAdded(address researchEntityId);
  event ResearchEntityProofAdded(address researchEntityId);
  event ResearchRequestAdded(address doctorId);
  event ResearchAccessGranted(address researchEntityId);

  // MAPPING

  mapping (address => Doctor) public doctors;
  mapping (address => Hospital) public hospitals;
  mapping (address => Patient) public patients;
  mapping (address => EmergencyAccess) public emergencyPerson;
  mapping (address => DoctorPatients)  doctorPatients;
  mapping (address => ResearchEntity) public researchEntity;
  mapping (address => DoctorRequest)  doctorRequest;



  // ADMIN
   modifier checkAdmin {
    require(msg.sender == ADMINID, "Sen no ad");
    _;
  }

 // COMMON
  modifier senderExists {
    require(doctors[msg.sender].id == msg.sender || patients[msg.sender].id == msg.sender, "Sen no ex");
    _;
  }

 // PATIENT
  
   modifier senderIsPatient{
    require(patients[msg.sender].id == msg.sender, "Sen no pat");
    _;
  }

   modifier patientExists(address patientId) {
    require(patients[patientId].id == patientId, "No Pat");
    _;
  }
    modifier checkAccess(address patientId){
    bool access = false;
    for(uint i = 0; i < patients[patientId].permissions.length; i++){
      Permission memory permission = patients[patientId].permissions[i];
      if(permission.doctorId == msg.sender){
        if(permission.access == true){
        access = true;
        break;
      }
      }
    }

    require(access == true, "Acc den");
    _;
  }

  // DOCTOR

  modifier doctorExists(address doctorId) {
    require(doctors[doctorId].id == doctorId, "Doc no ex");
    _;
  }
   modifier senderIsDoctor {
    require(doctors[msg.sender].id == msg.sender, "Sen no doc");
    _;
  }

  // HOSPITAL

  modifier hospitalExists(address hospitalId){
    require(hospitals[hospitalId].id == hospitalId,'hos no ex');
    _;
  }

  modifier senderIsHospital{
    require(hospitals[msg.sender].id == msg.sender,'Sen no hos');
    _;
  }


  // EMERGENCY PERSON

   modifier personExists(address personId){
    require(emergencyPerson[personId].id == personId,"No Per");
    _;
  }


  modifier senderIsEmergencyAccess {
    bool exists = false;
    for(uint i = 0; i < patients[emergencyPerson[msg.sender].patientId].emergencyAccess.length; i++){
      if(patients[emergencyPerson[msg.sender].patientId].emergencyAccess[i].id == msg.sender){
        if(patients[emergencyPerson[msg.sender].patientId].emergencyAccess[i].isAccess == true){
        exists = true;
        break;
      }
      }
    }

    require(exists,"No Eme acc");
    _;
  }

  // RESEARCH ENTITY

  modifier senderIsResearchEntity{
    require(researchEntity[msg.sender].id == msg.sender,'sen no res');
    _;
  }

  modifier researchEntityExists(address researchEntityId){
    require(researchEntity[researchEntityId].id == researchEntityId,'res no ex');
    _;
  }
  // FUNCTIONS

  function getSenderRole() public view returns (string memory) {
    if (doctors[msg.sender].id == msg.sender) {
      return "doctor";
    } else if (patients[msg.sender].id == msg.sender) {
      return "patient";
    } else if (msg.sender == ADMINID){
      return "admin";
    } else if(hospitals[msg.sender].id == msg.sender){
      return "hospital";
    } else if(emergencyPerson[msg.sender].id == msg.sender){
      return "emergencyPerson";
    } else if(researchEntity[msg.sender].id == msg.sender){
      return "researchEntity";
    }else {
      return "unknown";
    }
  }

  // ADMIN

   function addDoctor(address _doctorId,address _hospitalId) public checkAdmin {
    require(doctors[_doctorId].id != _doctorId, "doc ex");
    doctors[_doctorId].id = _doctorId;
    require(hospitals[_hospitalId].id == _hospitalId, "hos no ex");
    doctors[_doctorId].hospitalId = _hospitalId;

    bool exists = false;

    for(uint i = 0; i < hospitals[_hospitalId].doctors.length; i++){
      if(hospitals[_hospitalId].doctors[i].id == _doctorId){
        exists = true;
        break;
      }
    }

    require(!exists,"doc reg hos");
    Doctor memory doctor = Doctor(_doctorId,_hospitalId,doctors[_doctorId].proofCID);
    hospitals[_hospitalId].doctors.push(doctor);


    emit DoctorAdded(_doctorId);
  }
  function addDoctorProof(address _doctorId,string memory _proofCID,string memory _fileName) public checkAdmin{
    Proof memory proof = Proof(_proofCID,_fileName);
    doctors[_doctorId].proofCID = proof;

    emit DoctorProofAdded(_doctorId);
  }
    function getDoctor(address _doctorId) public view checkAdmin doctorExists(_doctorId) returns(Doctor memory){
    Doctor memory doctor = Doctor(doctors[_doctorId].id,doctors[_doctorId].hospitalId,doctors[_doctorId].proofCID);
    return doctor;
  }
    function getDoctorExists(address _doctorId) public view returns (bool) {
    return doctors[_doctorId].id == _doctorId;
  }
   function addHospital(address _hospitalId) public checkAdmin{
    require(hospitals[_hospitalId].id != _hospitalId,"hos ex");
    hospitals[_hospitalId].id = _hospitalId;

    emit HospitalAdded(_hospitalId);
  }
    function addHospitalProof(address _hospitalId,string memory _proofCID,string memory _fileName) public checkAdmin{
    Proof memory proof = Proof(_proofCID,_fileName);
    hospitals[_hospitalId].proofCID = proof;

    emit HospitalProofAdded(_hospitalId);
  }
   function getHospital(address _hospitalId) public view checkAdmin returns(Hospital memory){
    require(hospitals[_hospitalId].id == _hospitalId,"hos no ex");
    Hospital memory hospital = Hospital(hospitals[_hospitalId].id,hospitals[_hospitalId].doctors,hospitals[_hospitalId].proofCID);
    return hospital;
  }
   function getHospitalExists(address _hospitalId) public view checkAdmin returns (bool) {
    return hospitals[_hospitalId].id == _hospitalId;
  }

  function addResearchEntity(address _researchEntityId) public checkAdmin{
    require(researchEntity[_researchEntityId].id != _researchEntityId,'res al ex');
    researchEntity[_researchEntityId].id = _researchEntityId;

    emit ResearchEntityAdded(_researchEntityId);
  }
  function addResearchEntityProof(address _researchEntityId,string memory _proofCID,string memory _fileName) public checkAdmin{
    Proof memory proof = Proof(_proofCID,_fileName);
    researchEntity[_researchEntityId].proofCID = proof;

    emit ResearchEntityProofAdded(_researchEntityId);
  }
   function getResearchEntity(address _researchEntityId) public view checkAdmin researchEntityExists(_researchEntityId) returns(ResearchEntity memory){
    ResearchEntity memory research = ResearchEntity(researchEntity[_researchEntityId].id,researchEntity[_researchEntityId].proofCID);
    return research;
  }
     function getResearchEntityExists(address _researchEntityId) public view checkAdmin returns (bool) {
    return researchEntity[_researchEntityId].id == _researchEntityId;
  }
 

  // DOCTOR
  function verifyAccess(address _patientId,address _doctorId) public view senderIsDoctor patientExists(_patientId) returns (bool){
     bool access = false;
    for(uint i = 0; i < patients[_patientId].permissions.length; i++){
      if(patients[_patientId].permissions[i].doctorId == _doctorId){
        if(patients[_patientId].permissions[i].access == true){
        access = true;
        break;
      }
      }
    }
    return access;
  }

  function addPatient(address _patientId) public senderIsDoctor{
    require(patients[_patientId].id != _patientId, "pat ex");
    patients[_patientId].id = _patientId;
    bool exists = false;
    for(uint i = 0; i < doctorPatients[msg.sender].patientAddress.length; i++){
      if(doctorPatients[msg.sender].patientAddress[i] == _patientId){
        exists = true;
        break;
      }
    }
    if(!exists){
      doctorPatients[msg.sender].patientAddress.push(_patientId);
    }


    emit PatientAdded(_patientId);
  }

  function addRecord(string memory _cid, string memory _fileName, address _patientId) public senderIsDoctor patientExists(_patientId) checkAccess(_patientId) {
    Record memory record = Record(_cid, _fileName, _patientId, msg.sender, block.timestamp);
    patients[_patientId].records.push(record); 

    emit RecordAdded(_cid, _patientId, msg.sender);
  } 


   function requestAccess(address _patientId) public senderIsDoctor patientExists(_patientId){
    bool exists = false;
    for(uint i = 0; i < patients[_patientId].permissions.length; i++){
        if(patients[_patientId].permissions[i].doctorId == msg.sender){
          exists = true;
          break;
        }
    }
    require(!exists,"req ex");
    Permission memory permission = Permission(false,_patientId,msg.sender,doctors[msg.sender].hospitalId);
    patients[_patientId].permissions.push(permission);
  

    emit RequestAdded(_patientId);
  }


  function getRecordsDoctor(address _patientId) public view senderIsDoctor patientExists(_patientId) returns (Record[] memory){
    return patients[_patientId].records;
  }
    function getPatientExists(address _patientId) public view senderIsDoctor returns (bool) {
    return patients[_patientId].id == _patientId;
  }
     function getResearchRequests() public view doctorExists(msg.sender) senderIsDoctor returns (ResearchPermission[] memory){
    return doctorRequest[msg.sender].researchPermissions;
  }

  function verifyResearchEntityProof(address _researchEntityId) public view senderIsDoctor researchEntityExists(_researchEntityId) returns (Proof memory){
    return researchEntity[_researchEntityId].proofCID;
  }

  function grantResearchAccess(address _researchEntityId,bool _access) public senderIsDoctor researchEntityExists(_researchEntityId){
    for(uint i = 0; i < doctorRequest[msg.sender].researchPermissions.length; i++){
      if(doctorRequest[msg.sender].researchPermissions[i].researchEntityId == _researchEntityId){
        doctorRequest[msg.sender].researchPermissions[i].access = _access;
        break;
      }
    }

    emit ResearchAccessGranted(_researchEntityId);
  }


// PATIENT

  function getRequests(address _patientId) public view patientExists(_patientId) senderIsPatient returns (Permission[] memory){
    return patients[_patientId].permissions;
  }

  function grantAccess(address _doctorId,bool _access) public senderIsPatient doctorExists(_doctorId){
    for(uint i = 0; i < patients[msg.sender].permissions.length; i++){
      if(patients[msg.sender].permissions[i].doctorId == _doctorId){
        patients[msg.sender].permissions[i].access = _access;
        break;
      }
    }

    emit AccessGranted(_doctorId);
  }


    function addEmergencyAccess(address _personId,bool _access) public patientExists(msg.sender) senderIsPatient {
    bool exists = false;
    for(uint i = 0; i < patients[msg.sender].emergencyAccess.length; i++){
      if(patients[msg.sender].emergencyAccess[i].id == _personId){
        if(patients[msg.sender].emergencyAccess[i].isAccess == true){
          exists = true;
          break;
        }
      }
    }
    require(!exists,"per in");
    emergencyPerson[_personId].id = _personId;
    emergencyPerson[_personId].patientId = msg.sender; 
    EmergencyAccess memory emergency = EmergencyAccess(_personId,msg.sender,_access);
    patients[msg.sender].emergencyAccess.push(emergency);

    emit EmergencyAdded(_personId);

  }

  function getRecords(address _patientId) public view senderExists patientExists(_patientId) returns (Record[] memory) {
    return patients[_patientId].records;
  } 

  function viewEmergencyAccess() public view patientExists(msg.sender) senderIsPatient returns(EmergencyAccess[] memory){
    return patients[msg.sender].emergencyAccess;
  } 


  function viewAccessHistory() senderIsPatient public view returns (AccessHistory[] memory){
    return patients[msg.sender].accessHistory;
  }

  function manageEmergencyAccess(address _personId,bool _access) public personExists(_personId) senderIsPatient{
    for(uint i = 0; i < patients[msg.sender].emergencyAccess.length; i++){
      if(patients[msg.sender].emergencyAccess[i].id == _personId){
        patients[msg.sender].emergencyAccess[i].isAccess = _access;
        break;
      }
    }

    emit manageEmergency(_personId);
  }
    function verifyDoctor(address _doctorId) public view  doctorExists(_doctorId) returns(Proof memory){
    return doctors[_doctorId].proofCID;
  }
    function verifyHospital(address _hospitalId) public view  hospitalExists(_hospitalId) returns(Proof memory){
    return hospitals[_hospitalId].proofCID;
  }
 

   // EMERGENCY PERSON
  
   function giveEmergencyAccess(address _doctorId,bool _access) public senderIsEmergencyAccess doctorExists(_doctorId){
    for(uint i = 0; i < patients[emergencyPerson[msg.sender].patientId].permissions.length; i++){
       if(patients[emergencyPerson[msg.sender].patientId].permissions[i].doctorId == _doctorId){
        patients[emergencyPerson[msg.sender].patientId].permissions[i].access = _access;
        AccessHistory memory history = AccessHistory(_doctorId,msg.sender,block.timestamp,_access);
        patients[emergencyPerson[msg.sender].patientId].accessHistory.push(history);
        break;
      }
    }

    emit EmergencyAccessGranted(_doctorId);
  }
   function getRequestsByEmergency(address _patientId) public view patientExists(_patientId) senderIsEmergencyAccess returns (Permission[] memory){
    return patients[_patientId].permissions;
  }
  function getPatientIdEmergency() public view senderIsEmergencyAccess returns(address){
    return emergencyPerson[msg.sender].patientId;
  }

  // RESEARCH ENTITY

  function giveResearchRequest(address _doctorId) public senderIsResearchEntity doctorExists(_doctorId){
    bool exists = false;
    for(uint i = 0; i < doctorRequest[_doctorId].researchPermissions.length; i++){
      if(doctorRequest[_doctorId].researchPermissions[i].researchEntityId == msg.sender){
        exists = true;
        break;
      }
    }
    require(!exists,'req al ex');
    ResearchPermission memory researchPermission = ResearchPermission(msg.sender,_doctorId,false);
    doctorRequest[_doctorId].researchPermissions.push(researchPermission);

    emit ResearchRequestAdded(_doctorId);
  }

  function researchAccessRecords(address _doctorId) public view senderIsResearchEntity returns(Record[][] memory){
    Record[][] memory records = new Record[][](doctorPatients[_doctorId].patientAddress.length);
    uint index = 0;
    for(uint i = 0; i < doctorPatients[_doctorId].patientAddress.length; i++){
      for(uint j = 0; j < patients[doctorPatients[_doctorId].patientAddress[i]].permissions.length; j++){
        if(patients[doctorPatients[_doctorId].patientAddress[i]].permissions[i].doctorId == _doctorId){
          if(patients[doctorPatients[_doctorId].patientAddress[i]].permissions[i].access == true){
            records[index] = patients[doctorPatients[_doctorId].patientAddress[i]].records;
            index++;
            break;
          }
        }
      }
    }
    return records;
  }
    function verifyResearchAccess(address _doctorId) public view senderIsResearchEntity doctorExists(_doctorId) returns (bool){
     bool access = false;
    for(uint i = 0; i < doctorRequest[_doctorId].researchPermissions.length; i++){
      if(doctorRequest[_doctorId].researchPermissions[i].researchEntityId == msg.sender){
        if(doctorRequest[_doctorId].researchPermissions[i].access == true){
        access = true;
        break;
      }
      }
    }
    return access;
  }

  
} 
