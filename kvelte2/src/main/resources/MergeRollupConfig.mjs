
async function main() {
    const baseFilePath = process.argv[2]
    const mergeObject = process.argv[3]
    console.log('baseFilePath', baseFilePath)
    console.log('mergeObject', mergeObject)
    const baseObject = await import(baseFilePath)
    const merged = { ...baseObject, ...mergeObject }
    println(JSON.stringify(merged))
}

main()