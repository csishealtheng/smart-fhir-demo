import { useState, useEffect } from 'react';
import { oauth2 as SMART } from "fhirclient";

export default function Patient() {

    const [client, setClient] = useState(undefined);
    const [clientError, setClientError] = useState(undefined);
    const [patient, setPatient] = useState(undefined);

    useEffect(() => {
        SMART.ready().then(
            (client) => setClient(client),
            (error) => {
                console.log("SMART ready error " + JSON.stringify(error));
                setClientError(error)
            }
        );
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        if(client) {
            client.patient.read()
            .then(patient => {
                console.log("Patient read " + JSON.stringify(patient));
                setPatient(patient);
                setClientError(undefined);
            })
            .catch(error => {
                console.log("Client patient error " + JSON.stringify(error));
                setClientError(error);
            });
        }
    }, [client])  // eslint-disable-line react-hooks/exhaustive-deps


    const clientErrorBanner = () => {
        if(clientError) {
            return <div>
                {JSON.stringify(clientError)}!
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
        {clientErrorBanner()}
        {patientBanner()}
    </div>)
}