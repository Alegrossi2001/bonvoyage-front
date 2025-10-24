import { useEffect, useState } from "react";
import type { Team } from "../interfaces/Team";
import { SampleTeam } from "../../../DEMO/SampleTeam";

const useGetTeam = () => {
    const [team, setTeam] = useState<Team | null>(null);

    useEffect(() => {
        // Simula una chiamata API per ottenere i dati del team
        const fetchTeamData = async () => {
            setTeam(SampleTeam);
        };

        fetchTeamData();
    }, []);

    return { team };
}

export default useGetTeam;
