import { useState, useEffect, useRef } from 'react';
import { oauth2 as SMART } from "fhirclient";

export default function Patient() {

    const [client, setClient] = useState();
    const [patientError, setPatientError] = useState();
    const [patient, setPatient] = useState();
    const clientReady = useRef(false)

    // useEffect is called twice in React 18 *dev* mode, see https://stackoverflow.com/questions/72238175/useeffect-is-running-twice-on-mount-in-react
    useEffect(() => {
        console.log("SMART useEffect");
        if(!clientReady.current) {
            clientReady.current = true;
            console.log("Initializing SMART...");
            SMART.ready().then(
                (client) => {
                    console.log("SMART client ready");
                    setClient(client)
                },
                (error) => {
                    console.log("SMART ready error " + JSON.stringify(error));
                }
            )
        }
    }, [])  

    useEffect(() => {
        if(client) {
            console.log("Read patient...");
            if(client.getPatientId()) {
                console.log("Selected patient id " + client.getPatientId());
                client.request("Patient/" + client.getPatientId())  // using client.patient.read() causes error in production but not in dev?
                .then(patient => {
                    console.log("Patient read " + JSON.stringify(patient));
                    setPatient(patient);
                    setPatientError(undefined);
                })
                .catch(error => {
                    console.log("Patient read error " + JSON.stringify(error));
                    setPatientError(error);
                });    
            } else {
                console.log("No patient id set!");
            }
        }
    }, [client])  


    const patientErrorBanner = () => {
        if(patientError) {
            return <div>
                {JSON.stringify(patientError)}
            </div>
        } else {
            return <></>
        }
    }

    const patientBanner = () => {
        if(patient) {
            return (
                <div>
                    <div>
                        Patient data:
                    </div>
                    <div>
                        <span>Given name: <b>{patient.name[0].given}</b></span>
                    </div>
                    <div>
                        <span>Family name: <b>{patient.name[0].family}</b></span>
                    </div>
                    <div>
                        <span>Gender: <b>{patient.gender}</b></span>
                    </div>
                    <div>
                        <span>DOB: <b>{patient.birthDate}</b></span>
                    </div>
                </div>
            )
        } else {
            return <div>Waiting for patient...</div>
        };
    }

    return (<div>
        {patientErrorBanner()}
        {patientBanner()}
    </div>)
}