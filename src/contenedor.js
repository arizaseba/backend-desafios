import fs from "fs"

export default class Contenedor {
    // constructor que recibe nombre del archivo
    constructor(fileName) {
        this.fileName = fileName

        if (!fs.existsSync(this.fileName))
            fs.writeFileSync(fileName, "")
    }

    // guardar elemento
    async save(obj) {
        const list = await this.getAll();
        let id;

        if (list.length > 0 && list.some((s) => s.title === obj.title)) {
            console.log("El producto ya se encuentra en el catálogo");
            return
        }

        if (list.length == 0) {
            id = 1
        }
        else {
            id = list[list.length - 1].id + 1
        }

        // asigno nuevo id
        const newObj = { id: id, ...obj }
        // agrego al listado
        list.push(newObj)

        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(list, null, 2))
            return id
        }
        catch (err) {
            throw new Error(`Error al guardar un nuevo objeto: ${err}`)
        }
    }

    // obtener elemento
    async getById(id) {
        try {
            const list = await this.getAll()
            return list.find(item => item.id === id) ?? null
        }
        catch (err) {
            throw new Error(`No se encontro el dato: ${err}`)
        }
    }

    // obtener elementos
    async getAll() {
        try {
            const data = await fs.promises.readFile(this.fileName, "utf-8")
            return JSON.parse(data)
        }
        catch (err) {
            console.error(err)
            return []
        }
    }

    // eliminar elemento por id
    async deleteById(id) {
        const list = await this.getAll()
        const newList = list.filter(item => item.id !== id)
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(newList, null, 2))
        }
        catch (err) {
            throw new Error(`No se pudo borrar la data: ${err}`)
        }
    }

    // eliminar elementos
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify([], null, 2))
        }
        catch (err) {
            throw new Error(`No se pudo borrar la data: ${err}`)
        }
    }
}