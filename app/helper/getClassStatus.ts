import { RequestStatus } from "@/enum/requestStatus.enum";

const getClassStatus = (status: RequestStatus): string => {
	switch (status) {
		case RequestStatus.NEW:
			return "bg-blue-100 text-blue-800";
		case RequestStatus.NEW_DOCUMENTS:
			return "bg-blue-100 text-blue-800";
		case RequestStatus.FIXING:
			return "bg-yellow-100 text-yellow-800";
		case RequestStatus.FIXED:
			return "bg-yellow-100 text-yellow-800";
		case RequestStatus.NOT_FULFILLED:
			return "bg-yellow-100 text-yellow-800";
		case RequestStatus.FULFILLED:
			return "bg-yellow-100 text-yellow-800";
		case RequestStatus.PROCESSING:
			return "bg-blue-100 text-blue-800";
		case RequestStatus.COMPLETED:
			return "bg-green-100 text-green-800";
		case RequestStatus.REJECTED:
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export default getClassStatus;
