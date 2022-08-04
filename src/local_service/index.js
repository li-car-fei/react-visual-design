// import { notification } from 'antd'

class Request {
    constructor() {
        this.state = [
            {
                name: 'demo1-vue',
                description: 'demo1, for test',
                data: [],
                graphData: {
                    'counter': 0,
                    'graph': { nodes: [], edges: [] }
                },
                id: 0
            },
            {
                name: 'demo2-react',
                description: 'demo2, for test',
                data: [],
                graphData: {
                    'counter': 0,
                    'graph': { nodes: [], edges: [] }
                },
                id: 1
            }
        ]
    }

    get(data) {
        if (data.id) {
            return this.state[data.id]
        }
        return {
            count: this.state.length,
            rows: this.state
        }
    }

    put(data) {
        // new_data = { 'name': data.name, 'description': data.description }
        this.state[data.id]['data'] = data.data
        this.state[data.id]['graphData'] = data.graphData || {}
    }

    delete(data) {
        this.state.splice(data.id, 1)
    }

    post(data) {
        this.state.push({ ...data, id: this.state.length, data: [], graphData: {} })
    }

    requestBasic(httpType, data = null) {
        return new Promise((resolve, reject) => {
            switch (httpType) {
                case 'get':
                    resolve(this.get(data))
                    break
                case 'put':
                    resolve(this.put(data))
                    break
                case 'delete':
                    resolve(this.delete(data))
                    break
                case 'post':
                    resolve(this.post(data))
                    break
                default:
                    reject(new Error('http type error'))
            }
        })
    }
}

const request = new Request()

const visualPagePaging = params => request.requestBasic('get', params)
const geVisualPageById = id => request.requestBasic('get', { id })
const addVisualPage = data => request.requestBasic(`post`, data)
const updateVisualPage = data => request.requestBasic(`put`, data)
const updateVisualPageData = data => request.requestBasic(`put`, data)
const deleteVisualPage = id => request.requestBasic(`delete`, { id })

export {
    visualPagePaging,
    geVisualPageById,
    addVisualPage,
    updateVisualPage,
    updateVisualPageData,
    deleteVisualPage,
}


