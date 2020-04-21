{
    "_id" : ObjectId("5c6d73090c3d5054b766a76e"),
    "EmployeeName" : "Larry",
    "EmployeeSalary" : 9000,
    "EmployeeDetails" : [
       {
          "EmployeeDOB" : ISODate("1990-01-21T00:00:00Z"),
          "EmployeeDepartment" : "ComputerScience",
          "EmployeeProject" : [
             {
                "Technology" : "C",
                "Duration" : 6
             },
             {
                "Technology" : "Java",
                "Duration" : 7
             }
          ]
       }
    ]
 }


 db.nestedArrayDemo.update({"_id":ObjectId("5c6d73090c3d5054b766a76e"),
   "EmployeeDetails.EmployeeDepartment":"ComputerScience"}, {"$push":
   {"EmployeeDetails.$.EmployeeProject": {"Technology":"Python", "Duration":4 }}});
   WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })