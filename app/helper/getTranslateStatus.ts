import { RequestStatus } from "@/enum/requestStatus.enum";

const getTranslateStatus = (status: RequestStatus) => {
	switch (status) {
		case RequestStatus.NEW:
			return "BARU";
		case RequestStatus.NEW_DOCUMENTS:
			return "VERIFIKASI BERKAS";
		case RequestStatus.PROCESSING:
			return "DALAM PROSES";
		case RequestStatus.FIXING:
			return "PERBAIKAN";
		case RequestStatus.FIXED:
			return "TELAH DIPERBAIKI";
		case RequestStatus.NOT_FULFILLED:
			return "BELUM LENGKAP";
		case RequestStatus.FULFILLED:
			return "DILENGKAPI";
		case RequestStatus.COMPLETED:
			return "SELESAI";
		case RequestStatus.REJECTED:
			return "DITOLAK";
	}
};

export default getTranslateStatus;
