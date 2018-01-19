import React from "react";
import PropTypes from "prop-types";

export class NavigatorLink extends React.Component {
    render() {
        const { value, action } = this.props;

        return this.props.children({
            value, action
        });
    }
}

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

    shouldComponentUpdate(nextProps) {
        const nextEntries = nextProps["__react_pagination_paginator_total_entries_count"];
        const entries = this.props["__react_pagination_paginator_total_entries_count"];
        const { itemsPerPage } = this.paginatorConfig;

        const currentPages = Math.ceil(entries / itemsPerPage);
        const nextPages = Math.ceil(nextEntries / itemsPerPage);

        return currentPages !== nextPages;
    }

    render() {
        const toRender = [];
        const pages = Math.ceil(this.totalEntries / this.paginatorConfig.itemsPerPage);

        // If the 'renderIf' prop is defined, then we pass the current page and
        // the current page iteration. If the function returns true, render the Navigator Link.
        const fn = this.props.renderIf || (() => true);

        for (let i = 0; i < pages; i++) {
            if (!fn(i + 1, this.props["__react_pagination_current_page"]))
                continue;

            toRender.push(
                <NavigatorLink key={ i } value={ i + 1 } action={ () => { this.paginatorToPage(i + 1); } }>
                    {
                        this.props.children
                    }
                </NavigatorLink>
            );
        }

        return (
            <React.Fragment>{ toRender }</React.Fragment>
        );
    }
}

NavigatorBase.propTypes = {
    children: PropTypes.func.isRequired
};

NavigatorBase.navigatorName = "BaseNavigator";