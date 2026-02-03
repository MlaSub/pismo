const { withEntitlementsPlist } = require('@expo/config-plugins');

const withShareExtension = (config) => {
    config = withEntitlementsPlist(config, (entitlementsConfig) => {
        entitlementsConfig.modResults['com.apple.security.application-groups'] = [
            `group.${entitlementsConfig.ios?.bundleIdentifier}`,
        ];
        return entitlementsConfig;
    });

    return config;
};

module.exports = withShareExtension;
