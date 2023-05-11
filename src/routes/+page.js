export const load = ({ fetch }) => {
    const fetchPoints = async () => { 
      const res = await fetch('https://vda-lab.github.io/assets/ebi_ptm.json') 
      const data = await res.json() 
      return data
      console.log(data)
    }
  
    return {
      points: fetchPoints() 
    }
  }