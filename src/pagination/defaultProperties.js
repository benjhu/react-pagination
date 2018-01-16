import React from "react";

const Loading = () => (
    <React.Fragment>Loading...</React.Fragment>
);

export const prefix = "__react_pagination_";

export default {
    itemsPerPage: 5,
    showLoadingComponent: true,
    loadingComponent: Loading
};