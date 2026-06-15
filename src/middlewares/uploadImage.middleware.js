import createMulter from "../configs/produto.multer.js";

const uploadImage = createMulter({
    folder: 'images',
    allowedTypes: ['image/jpeg', 'image/png'],
    fileSize: 10 * 1024 * 1024 // 10 mb
}).single('imagem_produto');

export default uploadImage;