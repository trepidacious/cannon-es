/**
 * Experiment for testing ConvexHulls.
 */
var demo = new CANNON.Demo();

function createBoxHull(size){
    size = size || 1;
    var hullShape = new CANNON.ConvexHull();
    hullShape.addPoints([new CANNON.Vec3(-size,-size,-size),
			 new CANNON.Vec3( size,-size,-size),
			 new CANNON.Vec3( size, size,-size),
			 new CANNON.Vec3(-size, size,-size),
			 new CANNON.Vec3(-size,-size, size),
			 new CANNON.Vec3( size,-size, size),
			 new CANNON.Vec3( size, size, size),
			 new CANNON.Vec3(-size, size, size)],
			
			// At the moment the convex hull can't resolve normals and faces by itself, so we need to help it. This should be changed in the future
			[
			 [0,1,2,3], // -z
			 [4,5,6,7], // +z
			 [0,1,4,5], // -y
			 [2,3,6,7], // +y
			 [0,3,4,7], // -x
			 [1,2,5,6], // +x
			 ],
			
			[new CANNON.Vec3( 0, 0,-1),
			 new CANNON.Vec3( 0, 0, 1),
			 new CANNON.Vec3( 0,-1, 0),
			 new CANNON.Vec3( 0, 1, 0),
			 new CANNON.Vec3(-1, 0, 0),
			 new CANNON.Vec3( 1, 0, 0)]);
    return hullShape;
}

// Just 1 box on a plane
demo.addScene(function(app){
    var world = setupWorld(app);
    // ConvexHull box shape
    var size = 2;
    var hullShape = createBoxHull(size);
    // At the moment one must provide vertices, faces and normals..
    var mass = 10;
    var boxbody1 = new CANNON.RigidBody(mass,hullShape);
    boxbody1.position.set(0,0,size*2);
    boxbody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/4);
    world.add(boxbody1);
    app.addVisual(boxbody1);
  });

// Box on box tilting over
demo.addScene(function(app){
    var world = setupWorld(app);
    // ConvexHull box shape
    var size = 2;
    var hullShape = createBoxHull(size);
    var mass = 10;
    var boxbody1 = new CANNON.RigidBody(mass,hullShape);
    var boxbody2 = new CANNON.RigidBody(mass,hullShape);
    boxbody1.position.set(0,0,size+1);
    boxbody2.position.set(1.5,0,4*size+1);
    world.add(boxbody1);
    world.add(boxbody2);
    app.addVisual(boxbody1);
    app.addVisual(boxbody2);
  });

// Pile of boxes
demo.addScene(function(app){
    var world = setupWorld(app);
    // ConvexHull box shape
    var size = 1;
    var hullShape = createBoxHull(size);
    var mass = 10;
    for(var i=0; i<3; i++){
	for(var j=0; j<3; j++){
	    var boxbody = new CANNON.RigidBody(mass,hullShape);
	    boxbody.position.set(2*size*i+0.01,0,2*size*j + size*1.2);
	    world.add(boxbody);
	    app.addVisual(boxbody);
	}
    }
  });

demo.addScene(function(app){
    var world = setupWorld(app);
    // ConvexHull box shape
    var size = 0.5;
    var hullShape = createBoxHull(size);
    var mass = 10;
    var boxbody = new CANNON.RigidBody(mass,hullShape);
    boxbody.position.set(1,0,size+1);
    world.add(boxbody);
    app.addVisual(boxbody);

    // ConvexHull tetra shape
    var tetraShape = new CANNON.ConvexHull();
    // At the moment one must provide vertices, faces and normals..
    tetraShape.addPoints([new CANNON.Vec3(0,0,0),
			  new CANNON.Vec3(2,0,0),
			  new CANNON.Vec3(0,2,0),
			  new CANNON.Vec3(0,0,2)],
			 
			 [
			  [0,3,2], // -x
			  [0,1,3], // -y
			  [0,1,2], // -z
			  [1,3,2], // +xyz
			  ],
			 
			 [new CANNON.Vec3(-1, 0, 0),
			  new CANNON.Vec3( 0,-1, 0),
			  new CANNON.Vec3( 0, 0,-1),
			  new CANNON.Vec3( 1, 1, 1)]);
    var tetraBody = new CANNON.RigidBody(mass,tetraShape);
    tetraBody.position.set(5,-3,size+1);
    world.add(tetraBody);
    app.addVisual(tetraBody);

    // ConvexHull cylinder shape
    var cylinderShape = new CANNON.ConvexHull();
    // At the moment one must provide vertices, faces and normals..
    var num = 20;
    var verts = [];
    var normals = [];
    var faces = [];
    var bottomface = [];
    var topface = [];
    var L = 1, R = 0.5;
    verts.push(new CANNON.Vec3(R*Math.cos(0),
			       R*Math.sin(0),
			       -L));
    bottomface.push(0);
    verts.push(new CANNON.Vec3(R*Math.cos(0),
			       R*Math.sin(0),
			       L));
    topface.push(1);
    for(var i=0; i<num; i++){
      // Bottom
      var theta = 2*Math.PI/num * (i+1);
      var thetaN = 2*Math.PI/num * (i+0.5);
      if(i<num-1){
	// Bottom
	verts.push(new CANNON.Vec3(R*Math.cos(theta),
				   R*Math.sin(theta),
				   -L));
	bottomface.push(2*(i+1));
	// Top
	verts.push(new CANNON.Vec3(R*Math.cos(theta),
				   R*Math.sin(theta),
				   L));
	topface.push(2*(i+1)+1);
	// Normal
	normals.push(new CANNON.Vec3(Math.cos(thetaN),
				     Math.sin(thetaN),
				     0));
	// Face
	faces.push([2*i, 2*i+1, 2*(i+1), 2*(i+1)+1]);
      } else {
	faces.push([2*i, 2*i+1, 0, 1]);
	
	// Normal
	normals.push(new CANNON.Vec3(Math.cos(thetaN),
				     Math.sin(thetaN),
				     0));
      }
    } 
    faces.push(topface);
    normals.push(new CANNON.Vec3(0,0,1));
    faces.push(bottomface);
    normals.push(new CANNON.Vec3(0,0,-1));
    cylinderShape.addPoints(verts,faces,normals);
    var cylinderBody = new CANNON.RigidBody(mass,cylinderShape);
    cylinderBody.position.set(1,-3,size+1);
    cylinderBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/3);
    world.add(cylinderBody);
    app.addVisual(cylinderBody);

  });

function setupWorld(app){
  // Create world
  var world = new CANNON.World();
  app.setWorld(world);
  world.gravity.set(0,0,-40);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  // ground plane
  var n = new CANNON.Vec3(0,0,1);
  n.normalize();
  var groundShape = new CANNON.Plane(n);
  var groundBody = new CANNON.RigidBody(0,groundShape);
  groundBody.position.set(-10,0,0);
  world.add(groundBody);
  app.addVisual(groundBody);

  return world;
};

demo.start();