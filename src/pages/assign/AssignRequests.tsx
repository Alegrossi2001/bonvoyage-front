import useGetTeam from "./logic/useGetTeam";

const AssignRequests = () => {

    const { team } = useGetTeam();

    return <div>Assegna richieste Page - questa pagina mostra le richieste di assegnazione per il team: {team?.me.name}, il business {team?.organisationId}</div>;
}

export default AssignRequests;