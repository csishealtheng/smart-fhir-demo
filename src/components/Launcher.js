import { oauth2 as SMART } from "fhirclient";
import React, { useEffect } from "react";


function Launcher() {

    useEffect(() => {
        SMART.authorize({
            clientId: "693a2772-1ebc-4f0d-b397-a134f1861746",
            scope: "patient/Patient.read patient/Observation.read launch/patient online_access openid profile",
            redirectUri: "http://localhost:3000/patient",
            
            // iss parameter set here when doing a standalone launch
            //iss: "https://fhir-myrecord.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d"

        });

    }, []);

    return (
        <div>Launching SMART App...</div>
    )

}

export default Launcher;