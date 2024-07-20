export const EXTERNAL_CHANNEL = new Map([
    ['miracle.hello-hanni', {
        id: '1264186737068867615',
        name: 'Miracle',
        admin: [
            '938462551321243798',
            '1181302647928660102',
            '387153882251395073',
            '952848783421632513'
        ]
    }],
]);

export function isExternalAdminById(id, adminIdList) {
    for (let value of adminIdList.values()) {
        if (value === id) {
            return true;
        }
    }
    return false;
}