export const EXTERNAL_SERVER = new Map([
    ['miracle', {
        id: '1113802578808020992',
        name: 'Miracle',
        admin: [
            '938462551321243798',
            '1181302647928660102',
            '387153882251395073',
            '952848783421632513'
        ],
        channel: new Map([
            ['hello-hanni', '1264186737068867615'],
            ['music-bot', '1113806027842912276'],
        ])
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