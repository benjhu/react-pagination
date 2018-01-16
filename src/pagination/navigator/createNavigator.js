import React from "react";
import { NavigatorBase } from "./NavigatorBase";

export default (fn, wrapper) => {
    let Wrap;

    if (wrapper)
        Wrap = wrapper;
    else Wrap = React.Fragment;

    class CustomNavigator extends React.Component {
        render() {
            return (
                <Wrap>
                    <NavigatorBase { ...this.props }>
                        {
                            fn
                        }
                    </NavigatorBase>
                </Wrap>
            );
        }
    }

    // Default name for this Navigator.
    // The user can redefine it after calling the createNavigator()
    // function.
    CustomNavigator.navigatorName = "CustomNavigator";

    return CustomNavigator;
};