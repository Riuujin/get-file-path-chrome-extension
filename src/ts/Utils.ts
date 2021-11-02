export const generateId = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

export const getVersion = () => {
    if (typeof (chrome) !== 'undefined') {
        return chrome.runtime.getManifest().version;
    }
    return '1.1.2';
}