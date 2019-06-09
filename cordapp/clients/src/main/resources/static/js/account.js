
function createAccount(){

    var endpoint = '/api/account/create';

    var name = $('#create-name').val();
    var document = $('#create-document').val();
    var balance = $('#create-balance').val();

    var payload = {
            name : name,
            document : document,
            balance : balance
        }

    $.ajax({
       url: endpoint,
       type: 'PUT',
       headers: {
           "content-type": 'application/json',
       },
       data: JSON.stringify( payload ),
       success: function(response) {
         loadAccounts();
       }
    }).fail(function (jqXHR, textStatus, error) {
        console.log('Status: ', textStatus);
        console.log('Error: ', error);
        console.log('Message: ', jqXHR.responseText);
     });

}

function loadAccounts(){

    $('#accountTable').find('tr').remove()
    $('#accountTable').append('<tr><td>ID</td><td>Nome</td><td>Saldo</td></tr>');

    var endpoint = 'http://localhost:10050/all';

    $.get(endpoint, function(data, status){

        data.forEach(function(item, index){

            $('#accountTable').append('<tr>' +
            '<td>'+ item.state.data.linearId.id +'</td>' +
            '<td>'+ item.state.data.account.name +'</td>' +
            '<td>'+ item.state.data.account.balance +'</td>' +
            '</tr>');


        });

    });

}