export const CODE_JEANS_SERVER = '1251934898025926776'

export const CODE_JEANS_CATEGORY = new Map([
    ['public', '1252238878538993776'],
    ['super', '1251934901780086832'],
    ['hanni', '1259851371159752776'],
    ['documentation-general','1251935623099584604'],
    ['documentation-fe','1251938744852938913'],
    ['documentation-be','1251938676968001536'],
    ['documentation-ai','1251938789027352636'],
    ['documentation-web3','1251953049614946457']
]);

export const CODE_JEANS_CHANNEL = new Map([
    ['hello-hanni-private', '1252175596780392469'],
    ['hello-hanni', '1252239305808810065'],
    ['text-chat', '1251934901780086831']
]);

export const CODE_JEANS_FOUNDER = new Map([
    ['Nuciz', '938462551321243798'],
    ['Rico', '567349433843449887']
])

export function isAdminById(id) {
    for (let value of CODE_JEANS_FOUNDER.values()) {
        if (value === id) {
            return true;
        }
    }
    return false;
}