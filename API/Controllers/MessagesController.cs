using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController(IUnitOfWork uof) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await uof.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
            var recipient = await uof.MemberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);
            if(recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
            {
                return BadRequest("Cannot send this message");
            }
            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                Content = createMessageDto.Content
            };
            uof.MessageRepository.AddMessage(message);
            if(await uof.Complete()) return message.ToDto();
            return BadRequest("Failed to send message");
        }
        [HttpGet]
        public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessageByContainer 
        ([FromQuery] MessageParams messageParams)
        {
            messageParams.MemberId = User.GetMemberId();

            return await uof.MessageRepository.GetMessagesForMember(messageParams);
        }
        [HttpGet("thread/{reciepientId}")]
        public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string reciepientId)
        {
            return Ok(await uof.MessageRepository.GetMessageThread(User.GetMemberId(), reciepientId));
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(string id)
        {
            var memeberId = User.GetMemberId();
            var message = await uof.MessageRepository.GetMessage(id);

            if(message == null) return BadRequest("Cannot delete this message");

            if(message.SenderId != memeberId 
            && message.RecipientId != memeberId) 
            return BadRequest("You cannot delete this message");

            if(message.SenderId == memeberId) message.SenderDeleted = true;
            if(message.RecipientId == memeberId) message.RecipientDelete = true;

            if(message is {SenderDeleted: true, RecipientDelete: true })
            {
                uof.MessageRepository.DeleteMessage(message);
            }
            if(await uof.Complete()) return Ok("");

            return BadRequest("Problem deleting message");
        }
    }
}