const canvas = document.createElement("canvas");
canvas.width=700;
canvas.height=700;
document.body.append(canvas);
const ctx = canvas.getContext("2d");
ctx.translate(350,350);


class Vec{
    constructor(x=0,y=0,z=0){this.x = x;this.y = y;this.z = z;}
    add(v){return new Vec(this.x+=v.z,this.y+=v.z,this.y+=v.z)}
    static add(t,v){return new Vec(t.x+v.x,t.y+v.y,t.z+v.z);}

    subtract(v){return new Vec(this.x-v.x,this.y-v.y,this.y-v.z);}
    static subtract(t,v){return new Vec(t.x-v.x,t.y-v.y,t.z-v.z);}

    scale(s){return new Vec(this.x*s,this.y*s,this.z*s);}
    static scale(v,s){return new Vec(v.x*s,v.y*s,v.z*s);}

    dot(v){return this.x*v.x+this.y*v.y+this.z*v.z;}
    static dot(t,v){return t.x*v.x+t.y*v.y+t.z*v.z;}

    cross(v){return new Vec(this.y*v.z-this.z.v.y,this.z*v.x-this.x*v.z,this.x*v.y-this.y*v.x);}
    static cross(t,v){return new Vec(t.y*v.z-t.z*v.y,t.z*v.x-t.x*v.z,t.x*v.y-t.y*v.x);}

    magnitude(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);}
    static magnitude(v){return Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);}

    normalize(){let m = this.magnitude(); return new Vec(this.x/m,this.y/m,this.z/m);}
    static normalize(v){let m = v.magnitude(); return new Vec(v.x/m,v.y/m,v.z/m);}

    rotX(a){return new Vec(this.x,this.y * Math.cos(Math.PI/180*a) + Math.sin(Math.PI/180*a) *this.z, this.z * Math.cos(Math.PI/180*a) - this.y * Math.sin(Math.PI/180*a));}
    rotY(a){return new Vec(this.x * Math.cos(Math.PI/180*a) - Math.sin(Math.PI/180*a) * this.z,this.y,this.x * Math.sin(Math.PI/180*a) + this.z * Math.cos(Math.PI/180*a) );}
    rotZ(a){return new Vec(this.x * Math.cos(Math.PI/180*a) + this.y*Math.sin(Math.PI/180*a),this.x*- Math.sin(Math.PI/180*a)+this.y*Math.sin(Math.PI/180*a),this.z);};
    
}


class Triangle{
    constructor(a=new Vec(0,0,0),b=new Vec(0,0,0),c=new Vec(0,0,0)){
        this.a=a;
        this.b=b;
        this.c=c;
    }
}


class Mesh{
    constructor(){
        this.triangles = [];
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;
        this.pos = new Vec();
        this.palette = Array(12).fill(0).map((_,i) => `#${((1<<24) * Math.random() | 0 ).toString(16)}`);
    }

    add(t){
        this.triangles.push(t);
    }

    getRotMatrix(){
        let xMatrix = new Matrix(3,3);
        let yMatrix = new Matrix(3,3);
        let zMatrix = new Matrix(3,3);


        xMatrix.matrix[0][0] = 1;
        xMatrix.matrix[0][1] = 0;
        xMatrix.matrix[0][2] = 0;

        xMatrix.matrix[1][0] = 0;
        xMatrix.matrix[1][1] = Math.cos(Math.PI/180*this.rotX);
        xMatrix.matrix[1][2] = -Math.sin(Math.PI/180*this.rotX);

        xMatrix.matrix[2][0] = 0;
        xMatrix.matrix[2][1] = Math.sin(Math.PI/180*this.rotX);
        xMatrix.matrix[2][2] = Math.cos(Math.PI/180*this.rotX);

        yMatrix.matrix[0][0] = Math.cos(Math.PI/180*this.rotY);
        yMatrix.matrix[0][1] = 0;
        yMatrix.matrix[0][2] = Math.sin(Math.PI/180*this.rotY);

        yMatrix.matrix[1][0] = 0;
        yMatrix.matrix[1][1] = 1
        yMatrix.matrix[1][2] = 0;

        yMatrix.matrix[2][0] = -Math.sin(Math.PI/180*this.rotY);
        yMatrix.matrix[2][1] = 0
        yMatrix.matrix[2][2] = Math.cos(Math.PI/180*this.rotY);

        zMatrix.matrix[0][0] = Math.cos(Math.PI/180*this.rotZ);
        zMatrix.matrix[0][1] = -Math.sin(Math.PI/180*this.rotZ);
        zMatrix.matrix[0][2] = 0;

        zMatrix.matrix[1][0] = Math.sin(Math.PI/180*this.rotZ);
        zMatrix.matrix[1][1] = Math.cos(Math.PI/180*this.rotZ);
        zMatrix.matrix[1][2] = 0;

        zMatrix.matrix[2][0] = 0;
        zMatrix.matrix[2][1] = 0;
        zMatrix.matrix[2][2] = 1;

        return [xMatrix,yMatrix,zMatrix];

    }

    getRotated(){
        const [xMatrix,yMatrix,zMatrix] = this.getRotMatrix();
        let rotated = [];
        
        for(let i = 0; i<this.triangles.length;i++){
            
            let vecA = new Matrix(1,3);
            vecA.matrix[0][0] = this.triangles[i].a.x;
            vecA.matrix[0][1] = this.triangles[i].a.y;
            vecA.matrix[0][2] = this.triangles[i].a.z;

            let rotA = vecA.dot(xMatrix).dot(yMatrix).dot(zMatrix);

            let vecB = new Matrix(1,3);
            vecB.matrix[0][0] = this.triangles[i].b.x;
            vecB.matrix[0][1] = this.triangles[i].b.y;
            vecB.matrix[0][2] = this.triangles[i].b.z;

            let rotB = vecB.dot(xMatrix).dot(yMatrix).dot(zMatrix);

            let vecC = new Matrix(1,3);
            vecC.matrix[0][0] = this.triangles[i].c.x;
            vecC.matrix[0][1] = this.triangles[i].c.y;
            vecC.matrix[0][2] = this.triangles[i].c.z;

            let rotC = vecC.dot(xMatrix).dot(yMatrix).dot(zMatrix);

            let tri = new Triangle(new Vec(rotA.matrix[0][0],rotA.matrix[0][1],rotA.matrix[0][2]),new Vec(rotB.matrix[0][0],rotB.matrix[0][1],rotB.matrix[0][2]),new Vec(rotC.matrix[0][0],rotC.matrix[0][1],rotC.matrix[0][2]));

          
            rotated.push(tri);
        }
        return rotated;
    }


    getMoved(trs){
        let moved = [];
        for(let i = 0;i<trs.length;i++){
            moved.push(new Triangle(Vec.add(trs[i].a,this.pos),Vec.add(trs[i].b,this.pos),Vec.add(trs[i].c,this.pos)));
        }
        return moved;
    }

    draw(){
        let rotated = this.getRotated();
        let moved = this.getMoved(rotated);

        for(let i = 0; i<moved.length;i++){

            

           
            let AB = Vec.subtract(moved[i].b,moved[i].a);
            let AC = Vec.subtract(moved[i].c,moved[i].a);
            let crs0 = Vec.cross(AB,AC);
            let crs = crs0.normalize();

            moved[i].a.x = moved[i].a.x*(350/(350+moved[i].a.z)); moved[i].a.y = moved[i].a.y*(350/(350+moved[i].a.z));
            moved[i].b.x = moved[i].b.x*(350/(350+moved[i].b.z)); moved[i].b.y = moved[i].b.y*(350/(350+moved[i].b.z));
            moved[i].c.x = moved[i].c.x*(350/(350+moved[i].c.z)); moved[i].c.y = moved[i].c.y*(350/(350+moved[i].c.z));
            if(Vec.dot(crs,new Vec(0,0,1))<=0){
            ctx.fillStyle = this.palette[i%2==0?i:i-1];
            ctx.beginPath();
            ctx.moveTo(moved[i].a.x,moved[i].a.y);
            ctx.lineTo(moved[i].b.x,moved[i].b.y);
            ctx.lineTo(moved[i].c.x,moved[i].c.y);
            ctx.closePath();
            ctx.fill();
        }
        
        
    
        }

        
        

        /*
        
        for(let i = 0; i<this.triangles.length;i++){
            ctx.beginPath();
            ctx.moveTo(this.triangles[i].a.x*(350/(350+this.triangles[i].a.z)),this.triangles[i].a.y*(350/(350+this.triangles[i].a.z)));
            ctx.lineTo(this.triangles[i].b.x*(350/(350+this.triangles[i].b.z)),this.triangles[i].b.y*(350/(350+this.triangles[i].b.z)));
            ctx.lineTo(this.triangles[i].c.x*(350/(350+this.triangles[i].c.z)),this.triangles[i].c.y*(350/(350+this.triangles[i].c.z)));
            ctx.closePath();
            ctx.stroke();
        }
        */

    }

}

class Ray{
    constructor(o,d){
        this.o = o;
        this.d = d;
    }
}

class Color{
    constructor(r,g,b){
        this.r=r;
        this.g=g;
        this.b=b;
    }

}


class Matrix{
    constructor(row,col){
        this.row = row;
        this.col = col;
        this.matrix = [];
        for(var i=0; i<row;i++){
            this.matrix[i] = new Array(col);
        }
    }


    initialize(){
        for(var i =0; i<this.row;i++){
            for(var k = 0;k<this.col;k++){
                this.matrix[i][k] = Math.random()*2 - 1;
            }
        }
    }

    fill(x){
        var temp = new Matrix(this.row,this.col);

        for(var i = 0; i<this.row;i++){
            for(var k = 0; k<this.col;k++){
                temp.matrix[i][k] = x;
            }
        }

        return temp
    }

    T(){
        var temp = new Matrix(this.col,this.row);

        for(var i = 0; i<this.row;i++){
            for(var k = 0; k<this.col;k++){
                temp.matrix[k][i] = this.matrix[i][k];
            }
        }

        return temp

    }

    print(){
        console.table(this.matrix);
    }




    static createMatrix(row,col){
        return new Matrix(row,col);
    }

    static matrix(m){
        var temp = new Matrix(m.length, m[0].length);
        temp.matrix = m;
        return temp;
    }

    dot(m2){
        if(this.col != m2.row){
            throw "Shape Error: ("+this.row+","+this.col+") dot ("+m2.row+","+m2.col+") is not possible";
        }
        else{
            var product = new Matrix(this.row,m2.col)
    
            for(var i = 0; i<product.row;i++){
                for(var k = 0; k<product.col;k++){
                    product.matrix[i][k] = 0;
    
                    for(var a = 0; a<this.col;a++){
                        product.matrix[i][k] += this.matrix[i][a] * m2.matrix[a][k]
                    }
    
                }
            }
    
            return product;
    
        }
    }

    static dot(m1, m2){
        if(m1.col != m2.row){
            throw "Shape Error: ("+m1.row+","+m1.col+") dot ("+m2.row+","+m2.col+") is not possible";
        }
        else{
            var product = new Matrix(m1.row,m2.col)
    
            for(var i = 0; i<product.row;i++){
                for(var k = 0; k<product.col;k++){
                    product.matrix[i][k] = 0;
    
                    for(var a = 0; a<m1.col;a++){
                        product.matrix[i][k] += m1.matrix[i][a] * m2.matrix[a][k]
                    }
    
                }
            }
    
            return product;
    
        }
    }

    static subtract(m1,m2){
        if(m1.row != m2.row || m1.col!=m2.col){
            throw "Shape Error: ("+m1.row+","+m1.col+") dot ("+m2.row+","+m2.col+") is not possible";
        }
        else{
            var temp = new Matrix(m1.row,m1.col);
    
            for(var i=0;i<m1.row;i++){
                for(var k=0;k<m1.col;k++){
                    temp.matrix[i][k] = m1.matrix[i][k] - m2.matrix[i][k];
                }
            }
    
            return temp;
        }



        

}
static add(m1,m2){
    if(m1.row != m2.row || m1.col!=m2.col){
        throw "Shape Error: ("+m1.row+","+m1.col+") dot ("+m2.row+","+m2.col+") is not possible";
    }
    else{
        var temp = new Matrix(m1.row,m1.col);

        for(var i=0;i<m1.row;i++){
            for(var k=0;k<m1.col;k++){
                temp.matrix[i][k] = m1.matrix[i][k] + m2.matrix[i][k];
            }
        }

        return temp;
    }




}


static multiply(m1,m2){
    if(m1.row != m2.row || m1.col!=m2.col){
        throw "Shape Error: ("+m1.row+","+m1.col+") dot ("+m2.row+","+m2.col+") is not possible";
    }
    else{
        var temp = new Matrix(m1.row,m1.col);

        for(var i=0;i<m1.row;i++){
            for(var k=0;k<m1.col;k++){
                temp.matrix[i][k] = m1.matrix[i][k] * m2.matrix[i][k];
            }
        }

        return temp;
    }
}


static scale(m1,scalar){
    for(var i=0;i<m1.row;i++){
        for(var k=0;k<m1.col;k++){
            m1.matrix[i][k] *= scalar;
        }
    }
    return m1;
}

}


class Sphere{
    constructor(c,r,clr){
        this.c = c;
        this.r = r;
        this.clr = clr;
    }
    intersect(r){
        /*geometric solution_
        let oc = Vec.subtract(this.c,r.o);
        console.log(oc);
        let t = Vec.dot(oc,r.o);
        let p = Vec.add(r.o,Vec.scale(r.d,t));
        let y = Vec.magnitude(Vec.subtract(this.c,p));
        if(y<=this.c){
            let x = Math.sqrt(this.r*this.r+y*y);
            let t1 = t+x;
            let t2 = t-x;
            d = t1 < t2 ? t1 : t2;
            return true;
        }
        return false;

        */

        //analytical solution
        let oc = Vec.subtract(r.o,this.c);
        let b = 2 * Vec.dot(oc, r.d);
        let c = Vec.dot(oc,oc) - this.r* this.r;
        let disc = b*b - 4*c;
        let d = -1;
        if(disc>=0){
            disc = Math.sqrt(disc);
            let t1 = -b-disc;
            let t2 = -b+disc;
            d = t1 < t2 ? t1 : t2;
            return [true,d,oc.magnitude()/d];
        }
        return [false,d,oc.magnitude()/d];
        
    }

}






/*
//TOP FACE
cube.add(new Triangle(new Vec(-50,50,-50),new Vec(-50,50,50),new Vec(50,50,-50)));
cube.add(new Triangle(new Vec(50,50,50),new Vec(-50,50,50),new Vec(50,50,-50)));

//BOTTOM FACE
cube.add(new Triangle(new Vec(-50,-50,-50),new Vec(-50,-50,50),new Vec(50,-50,-50)));
cube.add(new Triangle(new Vec(50,-50,50),new Vec(-50,-50,50),new Vec(50,-50,-50)));

//FRONT FACE
cube.add(new Triangle(new Vec(-50,50,-50),new Vec(-50,-50,-50),new Vec(50,50,-50)));
cube.add(new Triangle(new Vec(50,-50,-50),new Vec(-50,-50,-50),new Vec(50,50,-50)));

//BACK FACE
cube.add(new Triangle(new Vec(-50,50,50),new Vec(-50,-50,50),new Vec(50,50,50)));
cube.add(new Triangle(new Vec(50,-50,50),new Vec(-50,-50,50),new Vec(50,50,50)));

//LEFT FACE
cube.add(new Triangle(new Vec(-50,50,-50),new Vec(-50,50,50),new Vec(-50,-50,-50)));
cube.add(new Triangle(new Vec(-50,-50,50),new Vec(-50,50,50),new Vec(-50,-50,-50)));

//RIGHT FACE
cube.add(new Triangle(new Vec(50,50,-50),new Vec(50,50,50),new Vec(50,-50,-50)));
cube.add(new Triangle(new Vec(50,-50,50),new Vec(50,50,50),new Vec(50,-50,-50)));
*/

function fillCube(mesh){
    mesh.add(new Triangle(new Vec(0,0,0),new Vec(0,100,0),new Vec(100,100,0)));
    mesh.add(new Triangle(new Vec(0,0,0),new Vec(100,100,0),new Vec(100,0,0)));

    mesh.add(new Triangle(new Vec(100,0,0),new Vec(100,100,0),new Vec(100,100,100)));
    mesh.add(new Triangle(new Vec(100,0,0),new Vec(100,100,100),new Vec(100,0,100)));

    mesh.add(new Triangle(new Vec(100,0,100),new Vec(100,100,100),new Vec(0,100,100)));
    mesh.add(new Triangle(new Vec(100,0,100),new Vec(0,100,100),new Vec(0,0,100)));

    mesh.add(new Triangle(new Vec(0,0,100),new Vec(0,100,100),new Vec(0,100,0)));
    mesh.add(new Triangle(new Vec(0,0,100),new Vec(0,100,0),new Vec(0,0,0)));

    mesh.add(new Triangle(new Vec(0,100,0),new Vec(0,100,100),new Vec(100,100,100)));
    mesh.add(new Triangle(new Vec(0,100,0),new Vec(100,100,100),new Vec(100,100,0)));

    mesh.add(new Triangle(new Vec(100,0,100),new Vec(0,0,100),new Vec(0,0,0)));
    mesh.add(new Triangle(new Vec(100,0,100),new Vec(0,0,0),new Vec(100,0,0)));
}


class Scene{
    constructor(){
        this.meshes = [];
    }

    add(mesh){
        this.meshes.push(mesh);
    }

    render(){
        ctx.clearRect(-350,-350,700,700);
        for(let i = 0; i<this.meshes.length;i++){
            this.meshes[i].draw();
        }
    }
}


scene = new Scene();
for(let i =0;i<30;i++){
    cube = new Mesh();
    fillCube(cube);
    cube.pos = new Vec(Math.random()*700-350,Math.random()*700-350,100);
    scene.add(cube);
}

function render(){
    scene.render();
    requestAnimationFrame(render);
}

render();



setInterval(function(){
    for(let i = 0; i<scene.meshes.length;i++){
        switch(i%3){
            case 0:
                scene.meshes[i].rotX = (scene.meshes[i].rotX+1)%360; 
                break;
            case 1:
                scene.meshes[i].rotY = (scene.meshes[i].rotY+1)%360; 
                break;
            case 2:
                scene.meshes[i].rotZ = (scene.meshes[i].rotZ+1)%360; 
                break;
        }
    }
},20);