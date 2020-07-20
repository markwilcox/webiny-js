import { SecurityIdentity } from "@webiny/api-security/utils";

const getAuthorizationToken = context => {
    const [event] = context.args;
    const { headers = {} } = event;
    return headers.authorization || headers.Authorization;
};

export default {
    name: "authentication-access-token",
    type: "authentication",
    authenticate: async context => {
        const { CmsAccessToken } = context.models;

        const accessToken = getAuthorizationToken(context);
        if (!accessToken) {
            return;
        }

        const token = await CmsAccessToken.findOne({
            query: { token: accessToken }
        });

        if (!token) {
            return;
        }

        return new SecurityIdentity({
            id: token.id,
            displayName: token.name,
            email: "",
            scopes: token.scopes
        });
    }
};