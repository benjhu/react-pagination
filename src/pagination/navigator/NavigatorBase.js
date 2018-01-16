import React from "react";
import PropTypes from "prop-types";

export class NavigatorBase extends React.Component {
    constructor(props) {
        super(props);

        // Props passed by the Paginator:
        //  - Current page
        //  - Total number of data entries
        //  - Paginator config
        this.paginatorConfig = this.props["__react_pagination_paginator_config"];
        this.totalEntries = this.props["__react_pagination_paginator_total_entries_count"];

        this.paginatorToPage = this.props["__react_pagination_paginator_to_page_fn"];
    }

    componentWillReceiveProps(nextProps) {
        const nextTotalEntries = nextProps["__react_pagination_paginator_total_entries_count"];
        if (this.totalEntries !== nextTotalEntries)
            this.totalEntries = nextTotalEntries;
    }

    render() {
        const toRender = [];
        const pages = this.totalEntries / this.paginatorConfig.itemsPerPage;

        for (let i = 0; i < pages; i++) {
            toRender.push(
                React.cloneElement(this.props.children({ value: i + 1 }), {
                    key: i, onClick: () => { this.paginatorToPage(i + 1); }
                })
            );
        }

        return (
            <div>{ toRender }</div>
        );
    }
}

NavigatorBase.propTypes = {
    children: PropTypes.func.isRequired
};

NavigatorBase.navigatorName = "BaseNavigator";