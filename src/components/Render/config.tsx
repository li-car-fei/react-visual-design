import * as VisualDesignComponents from '@/mobile_components'

export const componentRender = (body: any, data, callback) => {
    if (body === null || body === undefined) {
      return null;
    }

    if (typeof body === 'string' || typeof body === 'number') {
      return body;
    }

    const components = body.map((item: any) => {
        if (VisualDesignComponents[item.component]) {
            const Comp = VisualDesignComponents[item.component]
            return {Comp, data: item.data}
        }
        return { Comp: 'none_comp', data: item.data }
    });

    return components
}