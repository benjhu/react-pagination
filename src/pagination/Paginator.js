import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { pageIsWithinBounds } from "../util/utils";
import { messageGroup } from "../util/utils";

import defaults from "./defaultProperties";

const filterNavigators = component =>
    React.isValidElement(component) &&
    component.type.navigatorName &&
    component.type.navigatorName.endsWith("Navigator");

// TODO:

export default class Paginator extends React.Component {
    constructor(props) {
        super(props);
        this.toPage = this.toPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

        this.config = Object.assign({}, defaults, this.props.config);
        this.navigators = [];

        const children = this.props.children;

        // If there are multiple children, isolate the first child function and
        // all Navigators.
        if (_.isArray(children)) {
            this.passedFunction = children.find(_.isFunction);
            this.navigators = [...children.filter(filterNavigators)];
        } else if (_.isFunction(children)) {
            this.passedFunction = children;
        } else
            throw new Error("Pagination component did not receive a proper function as a child component to render paginated content.");

        this.state = {
            page: 1,
            data: this.props.initialData,
            loaded: this.props.initialData && !this.props.promise
        };
    }

    paginatorStatus() {
        messageGroup(false, true,
            [`  Total Entries: ${this.state.data.length}`],
            [`  Current Page: ${this.state.page}`]
        );
    }

    checkPageBounds(page) {
        if (!pageIsWithinBounds(this.state.data.length, this.config.itemsPerPage, page))
            throw new Error(`Unable to navigate to page ${page}.`);
    }

    toPage(page) {
        this.checkPageBounds(page);
        this.setState({ page });
    }

    nextPage() {
        const nextPage = this.state.page + 1;

        try {
            this.checkPageBounds(nextPage);
            this.toPage(nextPage);
        } catch(error) {
            messageGroup(true, false,
                [`The Paginator was not able to navigate to page ${nextPage}.`]
            );
        }
    }

    previousPage() {
        const previousPage = this.state.page - 1;

        try {
            this.checkPageBounds(previousPage);
            this.toPage(previousPage);
        } catch(error) {
            messageGroup(true, false,
                [`The Paginator was not able to navigate to page ${previousPage}.`]
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.promise) {
            Promise.resolve(nextProps.promise)
                .then(data => {
                    this.setState({ data, loaded: true });
                });
        }
    }

    componentDidMount() {
        // Resolve the promise, provided there is one, after mounting.
        // If initialData prop is present, that data will be rendered, if not,
        // the loading component will be displayed.
        if (this.props.promise)
            Promise.resolve(this.props.promise)
                .then(data => {
                    if (data)
                        this.setState({ data, loaded: true });
                });
    }

    render() {
        // Cut the data during render.
        const children = this.props.children;
        const toRender = [];
        const sliceStart = this.config.itemsPerPage * (this.state.page - 1);
        const sliceEnd = sliceStart + this.config.itemsPerPage;

        const pushToAndMapData = (data, array, fn) => {
            array.push(...data.slice(sliceStart, sliceEnd)
                .map(fn)
                .map((element, i) => React.cloneElement(element, { key: i })));
        };

        if (_.isArray(children)) {
            let fnExists = false;

            children.forEach(child => {
                if (_.isFunction(child)) {
                    if (!fnExists) {
                        if (this.state.loaded) {
                            pushToAndMapData(this.state.data, toRender, child);
                            fnExists = true;
                        }

                        else if (this.props.initialData)
                            pushToAndMapData(this.props.initialData, toRender, child);

                        else if (this.config.showLoadingComponent) {
                            const Loading = this.config.loadingComponent;
                            const loadingKey = "__react_pagination_paginator_loading_component";
                            let push;

                            if (React.isValidElement(Loading))
                                push = React.cloneElement(Loading, { key: loadingKey });
                            else {
                                try {
                                    push = (<Loading key={ loadingKey } />);
                                } catch (error) {
                                    throw new Error("Faulty loading component provided in Paginator configuration: ", error);
                                }
                            }

                            toRender.push(push);
                        }
                    } else child();
                } else
                    toRender.push(child);
            });

            if (this.state.loaded && !fnExists)
                throw new Error("A render prop (a function as a child component) needs to be provided to render paginated data.");
        }

        else if (_.isFunction(children))
            pushToAndMapData(this.state.data, toRender, children);

        else throw new Error("A function needs to be nested within the Paginator in order for data to be paginated.");

        return (
            <React.Fragment>
                { toRender }
                <div>Page: { this.state.page }</div>
                <button type="button" onClick={ this.previousPage }>Previous</button>
                <button type="button" onClick={ this.nextPage }>Next</button>
            </React.Fragment>
        );
    }
}

Paginator.propTypes = {
    initialData: PropTypes.array
};

Paginator.defaultProps = {
    config: {},
    promise: null,
    initialData: null
};