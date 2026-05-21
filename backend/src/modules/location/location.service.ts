import { LocationRepository } from "./location.repository";
import { parsePagination, paginate, PaginatedResponse } from "../../lib/pagination";
import { LocationItem } from "./location.types";

export class LocationService {
  private locationRepository: LocationRepository;

  constructor() {
    this.locationRepository = new LocationRepository();
  }

  async getLocations(query: Record<string, any>): Promise<PaginatedResponse<LocationItem>> {
    const pagination = parsePagination(query);
    const { data, total } = await this.locationRepository.findMany(pagination, query.name);
    return paginate(data as LocationItem[], total, pagination);
  }
}