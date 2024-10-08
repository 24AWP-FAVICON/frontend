import api from '../../Frontend_API';

export const tripPost = (data) => {
    return api.post(`/planner/trip`, data);
}

export const tripIdPost = (tripId, data) => {
    return api.post(`/planner/trip/${tripId}/detail`, data);
}
export const tripGet = () => {
    return api.get('/planner/trip');
};

export const tripIdGet = (tripId) => {
    return api.get(`/planner/trip/${tripId}`);
}

export const tripIdShare = (tripId, data) => {
    return api.post(`/planner/trip/${tripId}/share`, data);
}

export const tripIdPut = (tripId, data) => {
    return api.put(`/planner/trip/${tripId}`,data);
}

export const tripIdDelete = (tripId) => {
    return api.delete(`/planner/trip/${tripId}`);
}

export const tripIdPatch = (tripId, data) => {
    return api.patch(`/planner/trip/${tripId}`,data);
}

export const tripIdDetailGet = (tripId) => {
    return api.get(`/planner/trip/${tripId}/detail`);
}

export const tripIdDetailPut = (tripId, tripDateId, data) => {
    return api.put(`/planner/trip/${tripId}/detail/${tripDateId}`,data);
}

export const tripIdDetailDelete = (tripId, tripDateId) => {
    return api.delete(`/planner/trip/${tripId}/detail/${tripDateId}`);
}

export const tripIdDetailPatch = (tripId, tripDateId, data) => {
    return api.patch(`/planner/trip/${tripId}/detail/${tripDateId}`,data);
}