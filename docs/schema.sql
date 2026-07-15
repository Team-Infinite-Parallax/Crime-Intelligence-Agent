-- DATASET: Entity Relationship Diagram — Database Design Document
-- Karnataka Police Department | Confidential
-- Executable SQL DDL Schema Script for KSP FIR System

-- 1. State Table
CREATE TABLE State (
    StateID INT PRIMARY KEY,
    StateName VARCHAR(100) NOT NULL,
    NationalityID INT,
    Active BIT DEFAULT 1
);

-- 2. District Table
CREATE TABLE District (
    DistrictID INT PRIMARY KEY,
    DistrictName VARCHAR(100) NOT NULL,
    StateID INT,
    Active BIT DEFAULT 1,
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

-- 3. UnitType Table
CREATE TABLE UnitType (
    UnitTypeID INT PRIMARY KEY,
    UnitTypeName VARCHAR(100) NOT NULL,
    CityDistState VARCHAR(50),
    Hierarchy INT,
    Active BIT DEFAULT 1
);

-- 4. Unit (Police Stations) Table
CREATE TABLE Unit (
    UnitID INT PRIMARY KEY,
    UnitName VARCHAR(255) NOT NULL,
    TypeID INT,
    ParentUnit INT,
    NationalityID INT,
    StateID INT,
    DistrictID INT,
    Active BIT DEFAULT 1,
    FOREIGN KEY (TypeID) REFERENCES UnitType(UnitTypeID),
    FOREIGN KEY (StateID) REFERENCES State(StateID),
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID)
);

-- 5. Rank Table
CREATE TABLE Rank (
    RankID INT PRIMARY KEY,
    RankName VARCHAR(100) NOT NULL,
    Hierarchy INT,
    Active BIT DEFAULT 1
);

-- 6. Designation Table
CREATE TABLE Designation (
    DesignationID INT PRIMARY KEY,
    DesignationName VARCHAR(100) NOT NULL,
    Active BIT DEFAULT 1,
    SortOrder INT
);

-- 7. Employee Table
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    DistrictID INT,
    UnitID INT,
    RankID INT,
    DesignationID INT,
    KGID VARCHAR(50) UNIQUE,
    FirstName VARCHAR(100) NOT NULL,
    EmployeeDOB DATE,
    GenderID INT,
    BloodGroupID INT,
    PhysicallyChallenged BIT DEFAULT 0,
    AppointmentDate DATE,
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (UnitID) REFERENCES Unit(UnitID),
    FOREIGN KEY (RankID) REFERENCES Rank(RankID),
    FOREIGN KEY (DesignationID) REFERENCES Designation(DesignationID)
);

-- 8. CaseCategory Table
CREATE TABLE CaseCategory (
    CaseCategoryID INT PRIMARY KEY,
    LookupValue VARCHAR(50) NOT NULL
);

-- 9. GravityOffence Table
CREATE TABLE GravityOffence (
    GravityOffenceID INT PRIMARY KEY,
    LookupValue VARCHAR(50) NOT NULL
);

-- 10. CrimeHead Table
CREATE TABLE CrimeHead (
    CrimeHeadID INT PRIMARY KEY,
    CrimeGroupName VARCHAR(255) NOT NULL,
    Active BIT DEFAULT 1
);

-- 11. CrimeSubHead Table
CREATE TABLE CrimeSubHead (
    CrimeSubHeadID INT PRIMARY KEY,
    CrimeHeadID INT,
    CrimeHeadName VARCHAR(255) NOT NULL,
    SeqID INT,
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID)
);

-- 12. CaseStatusMaster Table
CREATE TABLE CaseStatusMaster (
    CaseStatusID INT PRIMARY KEY,
    CaseStatusName VARCHAR(100) NOT NULL
);

-- 13. Court Table
CREATE TABLE Court (
    CourtID INT PRIMARY KEY,
    CourtName VARCHAR(255) NOT NULL,
    DistrictID INT,
    StateID INT,
    Active BIT DEFAULT 1,
    FOREIGN KEY (DistrictID) REFERENCES District(DistrictID),
    FOREIGN KEY (StateID) REFERENCES State(StateID)
);

-- 14. CaseMaster Table (Core Star Schema)
CREATE TABLE CaseMaster (
    CaseMasterID INT PRIMARY KEY,
    CrimeNo VARCHAR(50) UNIQUE NOT NULL,
    CaseNo VARCHAR(50) NOT NULL,
    CrimeRegisteredDate DATE NOT NULL,
    PolicePersonID INT,
    PoliceStationID INT,
    CaseCategoryID INT,
    GravityOffenceID INT,
    CrimeMajorHeadID INT,
    CrimeMinorHeadID INT,
    CaseStatusID INT,
    CourtID INT,
    IncidentFromDate DATETIME,
    IncidentToDate DATETIME,
    InfoReceivedPSDate DATETIME,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    BriefFacts TEXT,
    FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (PoliceStationID) REFERENCES Unit(UnitID),
    FOREIGN KEY (CaseCategoryID) REFERENCES CaseCategory(CaseCategoryID),
    FOREIGN KEY (GravityOffenceID) REFERENCES GravityOffence(GravityOffenceID),
    FOREIGN KEY (CrimeMajorHeadID) REFERENCES CrimeHead(CrimeHeadID),
    FOREIGN KEY (CrimeMinorHeadID) REFERENCES CrimeSubHead(CrimeSubHeadID),
    FOREIGN KEY (CaseStatusID) REFERENCES CaseStatusMaster(CaseStatusID),
    FOREIGN KEY (CourtID) REFERENCES Court(CourtID)
);

-- 15. OccupationMaster Table
CREATE TABLE OccupationMaster (
    OccupationID INT PRIMARY KEY,
    OccupationName VARCHAR(100) NOT NULL
);

-- 16. ReligionMaster Table
CREATE TABLE ReligionMaster (
    ReligionID INT PRIMARY KEY,
    ReligionName VARCHAR(100) NOT NULL
);

-- 17. CasteMaster Table
CREATE TABLE CasteMaster (
    caste_master_id INT PRIMARY KEY,
    caste_master_name VARCHAR(100) NOT NULL
);

-- 18. ComplainantDetails Table
CREATE TABLE ComplainantDetails (
    ComplainantID INT PRIMARY KEY,
    CaseMasterID INT,
    ComplainantName VARCHAR(255) NOT NULL,
    AgeYear INT,
    OccupationID INT,
    ReligionID INT,
    CasteID INT,
    GenderID INT,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (OccupationID) REFERENCES OccupationMaster(OccupationID),
    FOREIGN KEY (ReligionID) REFERENCES ReligionMaster(ReligionID),
    FOREIGN KEY (CasteID) REFERENCES CasteMaster(caste_master_id)
);

-- 19. Act Table
CREATE TABLE Act (
    ActCode VARCHAR(50) PRIMARY KEY,
    ActDescription VARCHAR(255),
    ShortName VARCHAR(100),
    Active BIT DEFAULT 1
);

-- 20. Section Table
CREATE TABLE Section (
    ActCode VARCHAR(50),
    SectionCode VARCHAR(50),
    SectionDescription TEXT,
    Active BIT DEFAULT 1,
    PRIMARY KEY (ActCode, SectionCode),
    FOREIGN KEY (ActCode) REFERENCES Act(ActCode)
);

-- 21. ActSectionAssociation Table
CREATE TABLE ActSectionAssociation (
    CaseMasterID INT,
    ActID VARCHAR(50),
    SectionID VARCHAR(50),
    ActOrderID INT,
    SectionOrderID INT,
    PRIMARY KEY (CaseMasterID, ActID, SectionID),
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ActID, SectionID) REFERENCES Section(ActCode, SectionCode)
);

-- 22. Victim Table
CREATE TABLE Victim (
    VictimMasterID INT PRIMARY KEY,
    CaseMasterID INT,
    VictimName VARCHAR(255),
    AgeYear INT,
    GenderID INT,
    VictimPolice VARCHAR(10),
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

-- 23. Accused Table
CREATE TABLE Accused (
    AccusedMasterID INT PRIMARY KEY,
    CaseMasterID INT,
    AccusedName VARCHAR(255),
    AgeYear INT,
    GenderID INT,
    PersonID VARCHAR(50),
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID)
);

-- 24. ArrestSurrender Table
CREATE TABLE ArrestSurrender (
    ArrestSurrenderID INT PRIMARY KEY,
    CaseMasterID INT,
    ArrestSurrenderTypeID INT,
    ArrestSurrenderDate DATE,
    ArrestSurrenderStateId INT,
    ArrestSurrenderDistrictId INT,
    PoliceStationID INT,
    IOID INT,
    CourtID INT,
    AccusedMasterID INT,
    IsAccused BIT DEFAULT 0,
    IsComplainantAccused BIT DEFAULT 0,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (ArrestSurrenderStateId) REFERENCES State(StateID),
    FOREIGN KEY (ArrestSurrenderDistrictId) REFERENCES District(DistrictID),
    FOREIGN KEY (PoliceStationID) REFERENCES Unit(UnitID),
    FOREIGN KEY (IOID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (CourtID) REFERENCES Court(CourtID),
    FOREIGN KEY (AccusedMasterID) REFERENCES Accused(AccusedMasterID)
);

-- 25. CrimeHeadActSection Table
CREATE TABLE CrimeHeadActSection (
    CrimeHeadID INT,
    ActCode VARCHAR(50),
    SectionCode VARCHAR(50),
    PRIMARY KEY (CrimeHeadID, ActCode, SectionCode),
    FOREIGN KEY (CrimeHeadID) REFERENCES CrimeHead(CrimeHeadID),
    FOREIGN KEY (ActCode, SectionCode) REFERENCES Section(ActCode, SectionCode)
);

-- 26. ChargesheetDetails Table
CREATE TABLE ChargesheetDetails (
    CSID INT PRIMARY KEY,
    CaseMasterID INT,
    csdate DATETIME,
    cstype CHAR(1),
    PolicePersonID INT,
    FOREIGN KEY (CaseMasterID) REFERENCES CaseMaster(CaseMasterID),
    FOREIGN KEY (PolicePersonID) REFERENCES Employee(EmployeeID)
);
