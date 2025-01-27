import { StackContext, Cognito, StaticSite } from "sst/constructs";
import { Lazy } from "aws-cdk-lib";

export function Client({ stack }: StackContext) {
  let site: StaticSite | undefined;
  const siteUrl = Lazy.string({
    produce() {
      return site?.customDomainUrl ?? site?.url ?? "http://localhost:5173";
    },
  });

  const auth = new Cognito(stack, "ClientAuth", {
    login: ["email"],
    cdk: {
      userPoolClient: {
        oAuth: {
          flows: {
            authorizationCodeGrant: true,
          },
          callbackUrls: [siteUrl],
          logoutUrls: [siteUrl],
        },
      },
      userPool: {
        selfSignUpEnabled: false,
        standardAttributes: {
          givenName: { required: true },
          familyName: { required: true },
        },
      },
    },
  });

  const cognitoDomain = auth.cdk.userPool.addDomain("cognitoDomain", {
    cognitoDomain: { domainPrefix: `alabama-cyber-range-${stack.stage}-client` },
  });

  stack.addOutputs({
    VITE_CLIENT_APP_USER_POOL_ID: auth.userPoolId,
    VITE_CLIENT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId ?? "",
    VITE_CLIENT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    VITE_CLIENT_APP_COGNITO_DOMAIN: `${cognitoDomain.domainName}.auth.${stack.region}.amazoncognito.com`,
  });

  return;
}
