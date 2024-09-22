import api from '../../Frontend_API';

export const tripGet = () => {
    return api.get('/planner/trip');
};

export const tripIdGet = (data) => {
    return api.get('/planner/trip/{tripId}',data);
}

export const tripIdPut = (data) => {
    return api.put('/planner/trip/{tripId}',data);
}

export const tripIdDelete = () => {
    return api.delete('/planner/trip/{tripId}');
}

export const tripIdPatch = (data) => {
    return api.patch('/planner/trip/{tripId}',data);
}

export const tripIdDetailGet = (data) => {
    return api.get('/planner/trip/{tripId}/detail/{tripDateId}',data);
}

export const tripIdDetailPut = (data) => {
    return api.put('/planner/trip/{tripId}/detail/{tripDateId}',data);
}

export const tripIdDetailDelete = () => {
    return api.delete('/planner/trip/{tripId}/detail/{tripDateId}');
}

export const tripIdDetailPatch = (data) => {
    return api.patch('/planner/trip/{tripId}/detail/{tripDateId}',data);
}