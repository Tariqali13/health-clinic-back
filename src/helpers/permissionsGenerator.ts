// import { uuid } from "uuidv4"/
import { uuid } from "uuidv4"; 


const permissions = [
    "Dashboard",
    "Patients",
    "Treatments",
    "Billings",
    "Appointments",
    "User Management",
]


let GeneratedPermissions = [];


for (const value of permissions) {

    let NewVal = value.replace(" ", ".");

    GeneratedPermissions = [
        ...GeneratedPermissions,
        {
            _id: uuid(),
            PermissionTitle: value,
            Permissions: [
                {
                    PermissionName: `${NewVal}.View`,
                    _id: uuid(),
                    Title:"View",
                },
                {
                    PermissionName: `${NewVal}.Add`,
                    _id: uuid(),
                    Title:"Add",

                },
                {
                    PermissionName: `${NewVal}.Update`,
                    _id: uuid(),
                    Title:"Update",

                },
                {
                    PermissionName: `${NewVal}.Delete`,
                    _id: uuid(),
                    Title:"Delete",

                },
            ]
        }
    ]

}

console.log(JSON.stringify(GeneratedPermissions))