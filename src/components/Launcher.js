import { oauth2 as SMART } from "fhirclient";
import React, { useEffect } from "react";


function Launcher() {

    useEffect(() => {
        SMART.authorize({
            clientId: "d20a334f-5080-4e19-b1e3-641038d9c201",            
            scope: "patient/Patient.read patient/Observation.read patient/Condition.read patient/MedicationOrder.read patient/MedicationStatement.read launch online_access openid profile",
	        redirectUri: "http://18.130.113.10:4040/patient"
        });

    }, []);


    return (
        <div>Launching SMART App...</div>
    )

}

export default Launcher;