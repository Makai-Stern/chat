import React from 'react';

export default function PublicRoute({
    component: Component,
    layout: Layout,
    ...rest
}) {
    return (
        <Layout {...rest}>
            <Component {...rest} />
        </Layout>
    );
}
