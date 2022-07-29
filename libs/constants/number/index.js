const generateRandomXP = () => {
    return Math.floor(Math.random() * (999 - 1) + 1);
};

module.exports = {
    generateRandomXP
}