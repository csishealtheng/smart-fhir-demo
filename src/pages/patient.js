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
            console.log("Id token: " + JSON.stringify(client.getIdToken()));
            console.log("FhirUser: " + client.getFhirUser());
            console.log("UserType: " + client.getUserType());
            console.log("Token reposonse: " + JSON.stringify(client.getState("tokenResponse")));
            
            console.log("Read patient...");
            if(client.getPatientId()) {
                console.log("Selected patient id " + client.getPatientId());
                readPatient();
                readObservationsForPatient();
                readConditionsForPatient();
//                readMedicationRequestsForPatient();
		        readMedicationOrdersForPatient();		    
            } else {
                console.log("No patient id set!");
            }          
        }
    }, [client])  

    const readPatient = () => {
        client.request("Patient/" + client.getPatientId())  // using client.patient.read() causes error in production but not in dev?
        .then(patient => {
            console.log("Patient read " + JSON.stringify(patient));
            setPatient(patient);
        })
        .catch(error => {
            console.log("Patient read error " + JSON.stringify(error));
        });    
    }    

    const readObservationsForPatient = () => {
        client.request("Observation?patient="+client.getPatientId(), {
            pageLimit: 0
        })
        .then(observations => {
            console.log("Observations read " + JSON.stringify(observations));
        })
        .catch(error => {
            console.log("Observation read error " + JSON.stringify(error));
        });    
    }

    const readConditionsForPatient = () => {
        client.request("Condition?patient="+client.getPatientId(), {
            pageLimit: 0
        })
        .then(observations => {
            console.log("Conditions read " + JSON.stringify(observations));
        })
        .catch(error => {
            console.log("Conditions read error " + JSON.stringify(error));
        });    
    }

    // DSTU2
    const readMedicationOrdersForPatient = () => {
        client.request("MedicationOrder?patient="+client.getPatientId(), {
            pageLimit: 0
        })
        .then(observations => {
            console.log("MedicationOrder read " + JSON.stringify(observations));
        })
        .catch(error => {
            console.log("MedicationOrder read error " + JSON.stringify(error));
        });    
    }

    // R4
    const readMedicationRequestsForPatient = () => {
        client.request("MedicationRequest?patient="+client.getPatientId(), {
            pageLimit: 0
        })
        .then(observations => {
            console.log("MedicationRequest read " + JSON.stringify(observations));
        })
        .catch(error => {
            console.log("MedicationRequest read error " + JSON.stringify(error));
        });    
    }

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