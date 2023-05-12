export const load = ({ fetch, params }) => {
    const fetchPoints = async () => { 
    const res = await fetch('https://vda-lab.github.io/assets/ebi_ptm.json') 
    const data = await res.json() 
      
    data.forEach((d,i) => { d.id = i })
    let data_for_slug = data.find((d) => { return d.name == params.slug})
    return data_for_slug
    }
  
    return {
      points: fetchPoints() 
    }
  }