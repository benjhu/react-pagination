import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import PaginatorItem from "./PaginatorItem";
import { pageIsWithinBounds } from "../util/utils";
import { messageGroup } from "../util/utils";

import defaults, { prefix } from "./defaultProperties";

const concat = str => prefix.concat(str);

export default class Paginator extends React.Component {
    constructor(props) {
        super(props);
        this.toPage = this.toPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

        this.config = Object.assign({}, defaults, this.props.config);

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
        const { children } = this.props;
        const { itemsPerPage, identifier } = this.config;
        const Navigator = this.props.navigator;
        const toRender = [];
        const sliceStart = itemsPerPage * (this.state.page - 1);
        const sliceEnd = sliceStart + itemsPerPage;

        const pushToAndMapData = (data, array, fn) => {
            array.push(...data.slice(sliceStart, sliceEnd)
                .map((entry, i) => {
                    // Use the identifier provided by the user if possible as the key.
                    if (identifier) {
                        if (typeof identifier === "function")
                            i = identifier(entry, i);
                        else if (entry[identifier])
                            i = entry[identifier];
                        else messageGroup(true, false,
                            ["An identifier was specified, but was not able to resolve; defaulting to indicies."]
                        );
                    }

                    return (
                        <PaginatorItem key={ i }>{ fn(entry) }</PaginatorItem>
                    );
                }));
        };

        if (this.state.loaded)
            pushToAndMapData(this.state.data, toRender, children);

        else if (this.props.initialData)
            pushToAndMapData(this.props.initialData, toRender, children);

        else if (this.config.showLoadingComponent) {
            const Loading = this.config.loadingComponent;
            return (<Loading />);
        }

        else throw new Error("A function needs to be nested within the Paginator in order for data to be paginated.");

        if (Navigator) {
            const passInProps = {
                key: "__paginator_navigator",

                [concat("paginator_config")]: this.config,
                [concat("paginator_to_page_fn")]: this.toPage,
                [concat("paginator_current_page")]: this.state.page,
                [concat("paginator_total_entries_count")]:
                    this.state.data ? this.state.data.length : 0
            };

            toRender.push(
                <Navigator
                    { ...passInProps }
                />
            );
        }

        const ControlsTEMP = () => (
            <div>
                <div>Page: { this.state.page }</div>
                <button type="button" onClick={ this.previousPage }>Previous</button>
                <button type="button" onClick={ this.nextPage }>Next</button>
            </div>
        );

        return (
            <React.Fragment>
                { toRender }
                { <ControlsTEMP /> }
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