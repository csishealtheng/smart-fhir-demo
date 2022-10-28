import { oauth2 as SMART } from "fhirclient";
import React, { useEffect } from "react";


function Launcher() {

    useEffect(() => {
        SMART.authorize({
            clientId: "d20a334f-5080-4e19-b1e3-641038d9c201",            
            scope: "patient/Patient.read patient/Observation.read launch online_access openid profile"
        });

    }, []);

    return (
        <div>Launching SMART App...</div>
    )

}

export default Launcher;