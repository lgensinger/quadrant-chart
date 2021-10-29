import pkg from "../package.json";

const configuration = {
    name: pkg.name.replace("/", "-").slice(1)
};

const configurationDimension = {
    height: process.env.DIMENSION_HEIGHT || 600,
    width: process.env.DIMENSION_WIDTH || 600
}

const configurationLayout = {
    max: process.env.LAYOUT_MAX || 3,
    min: process.env.LAYOUT_MIN || 0
}

export { configuration, configurationDimension, configurationLayout };
export default configuration;
