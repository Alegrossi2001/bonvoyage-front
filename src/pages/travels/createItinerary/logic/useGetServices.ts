import { useEffect, useState } from "react"
import type { ServiceItem } from "../../createTravels/interfaces/ServiceItem"
import { SampleServices } from "../../../../DEMO/SampleServices"
const useGetServices = (id?: string) => {
    const [services, setServices] = useState<ServiceItem[]>([])

    useEffect(() => {
        const fetchData = () => {
            setServices(SampleServices)
        }

        fetchData()
    }, [id])

    return services
}

export default useGetServices