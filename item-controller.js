exports.getWorld = function(req,res){
    res.json({result: 'Welcome to Little-Indian Restaurant'});
}

exports.getWorldParams = function(req,res){
    res.json({message: 'Little-Indian Restaurant is the best!', data: [
        req.params.foo,
        req.params.bar
    ]});
};

exports.postWorld = function(req,res){
    res.json({result: 'Post completed!', data: req.body});
};